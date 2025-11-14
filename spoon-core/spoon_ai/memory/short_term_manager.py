"""Short-term memory management for conversation history."""

import logging
import math
import uuid
from datetime import datetime
from enum import Enum
from typing import List, Optional, Dict, Any, Tuple

from spoon_ai.schema import Message, SystemMessage
from spoon_ai.graph.checkpointer import InMemoryCheckpointer
from spoon_ai.graph.types import StateSnapshot
from .remove_message import RemoveMessage, REMOVE_ALL_MESSAGES

logger = logging.getLogger(__name__)


class TrimStrategy(str, Enum):
    """Strategy for trimming messages."""

    FROM_START = "from_start"  # Remove oldest messages first
    FROM_END = "from_end"  # Remove newest messages first


class MessageTokenCounter:
    """Approximate token counter aligned with LangChain semantics."""

    async def count_tokens(
        self, messages: List[Message], model: Optional[str] = None
    ) -> int:
        return self._approximate_count(messages)

    @staticmethod
    def _approximate_count(messages: List[Message]) -> int:
        chars_per_token = 4.0
        extra_tokens_per_message = 3.0
        token_count = 0.0

        for message in messages:
            message_chars = 0

            content = message.content
            if isinstance(content, str):
                message_chars += len(content)
            elif content is not None:
                message_chars += len(repr(content))

            if (
                message.role == "assistant"
                and message.tool_calls
                and not isinstance(message.content, list)
            ):
                message_chars += len(repr(message.tool_calls))

            if message.role == "tool" and message.tool_call_id:
                message_chars += len(message.tool_call_id)

            message_chars += len(message.role or "")

            if message.name:
                message_chars += len(message.name)

            token_count += math.ceil(message_chars / chars_per_token)
            token_count += extra_tokens_per_message

        total = math.ceil(token_count)
        return max(1, total)


def _ensure_message_ids(messages: List[Message]) -> None:
    for message in messages:
        if not getattr(message, "id", None):
            message.id = str(uuid.uuid4())


class ShortTermMemoryManager:
    """Manager for short-term conversation memory with advanced operations."""

    def __init__(
        self,
        checkpointer: Optional[InMemoryCheckpointer] = None,
        token_counter: Optional[MessageTokenCounter] = None,
        default_trim_strategy: TrimStrategy = TrimStrategy.FROM_END,
    ):

        self.checkpointer = checkpointer or InMemoryCheckpointer()
        self.token_counter = token_counter or MessageTokenCounter()
        self.default_trim_strategy = default_trim_strategy

    async def trim_messages(
        self,
        messages: List[Message],
        max_tokens: int,
        strategy: TrimStrategy = TrimStrategy.FROM_END,
        keep_system: bool = True,
        model: Optional[str] = None,
    ) -> List[Message]:
        """Trim messages using a LangChain-style heuristic."""
        if not messages:
            return []

        _ensure_message_ids(messages)

        if strategy not in {TrimStrategy.FROM_END, TrimStrategy.FROM_START}:
            raise ValueError(f"Unsupported trim strategy: {strategy}")

        total_tokens = await self.token_counter.count_tokens(messages, model)
        if total_tokens <= max_tokens:
            return messages

        system_message: Optional[Message] = None
        remaining = messages
        if (
            keep_system
            and strategy == TrimStrategy.FROM_END
            and messages
            and messages[0].role == "system"
        ):
            system_message = messages[0]
            remaining = messages[1:]

        if strategy == TrimStrategy.FROM_END:
            kept: List[Message] = []
            for message in reversed(remaining):
                trial = [message] + kept
                candidate = ([system_message] if system_message else []) + trial
                token_cost = await self.token_counter.count_tokens(candidate, model)
                if token_cost <= max_tokens or not kept:
                    kept = trial
            trimmed = ([system_message] if system_message else []) + kept
        else:
            kept: List[Message] = []
            for message in remaining:
                trial = kept + [message]
                token_cost = await self.token_counter.count_tokens(trial, model)
                if token_cost <= max_tokens or not kept:
                    kept = trial
                else:
                    break
            trimmed = kept

        if not trimmed:
            if system_message is not None:
                trimmed = [system_message]
            elif remaining:
                trimmed = [remaining[0]] if strategy == TrimStrategy.FROM_START else [remaining[-1]]
            else:
                trimmed = []

        logger.info(
            "Trimmed messages: %d -> %d (strategy=%s)",
            len(messages),
            len(trimmed),
            strategy.value,
        )
        return trimmed

    async def summarize_messages(
        self,
        messages: List[Message],
        max_tokens_before_summary: int,
        messages_to_keep: int = 5,
        summary_model: Optional[str] = None,
        llm_manager=None,
        llm_provider: Optional[str] = None,
        existing_summary: str = "",
    ) -> Tuple[List[Message], List[RemoveMessage], Optional[str]]:
        """Summarize earlier messages and emit removal directives."""
        if not messages or not llm_manager:
            return messages, [], existing_summary or None

        _ensure_message_ids(messages)

        total_tokens = await self.token_counter.count_tokens(messages, summary_model)
        if total_tokens <= max_tokens_before_summary:
            return messages, [], existing_summary or None

        if existing_summary:
            summary_prompt = (
                "This is a summary of the conversation to date: "
                f"{existing_summary}\n\n"
                "Extend the summary by taking into account the new messages above:"
            )
        else:
            summary_prompt = "Create a summary of the conversation above:"

        prompt_message = Message(role="user", content=summary_prompt)

        try:
            response = await llm_manager.chat(
                messages=messages + [prompt_message],
                provider=llm_provider,
                model=summary_model,
            )
            summary_text = response.content
        except Exception as exc:  # pragma: no cover - safeguard
            logger.error("Failed to generate summary: %s", exc)
            return messages, [], existing_summary or None

        start_index = max(len(messages) - messages_to_keep, 0)
        recent_messages = messages[start_index:]

        indices_to_keep = set(range(start_index, len(messages)))
        keep_system_message = messages and messages[0].role == "system"
        if keep_system_message:
            indices_to_keep.add(0)

        removals: List[RemoveMessage] = []
        for idx, message in enumerate(messages):
            if idx in indices_to_keep:
                continue
            message_id = getattr(message, "id", None)
            if message_id:
                removals.append(RemoveMessage(id=message_id))
            else:
                logger.debug("Skipping removal for message at index %s; no id present", idx)

        messages_for_llm: List[Message] = []
        if keep_system_message:
            messages_for_llm.append(messages[0])
            if recent_messages and recent_messages[0] is messages[0]:
                recent_messages = recent_messages[1:]

        if summary_text:
            summary_message = SystemMessage(
                id=f"summary-{uuid.uuid4()}",
                content=f"[CONVERSATION SUMMARY]\n{summary_text}",
            )
            messages_for_llm.append(summary_message)

        messages_for_llm.extend(recent_messages)

        if not messages_for_llm:
            messages_for_llm = list(messages)

        return messages_for_llm, removals, summary_text

    def save_checkpoint(
        self,
        thread_id: str,
        messages: List[Message],
        metadata: Optional[Dict[str, Any]] = None,
    ) -> str:
        
        checkpoint_id = str(uuid.uuid4())
        checkpoint_metadata = {
            "message_count": len(messages),
            "timestamp": datetime.now().isoformat(),
            "checkpoint_id": checkpoint_id,
            **(metadata or {})
        }

        _ensure_message_ids(messages)

        state_snapshot = StateSnapshot(
            values={"messages": [msg.model_dump() for msg in messages]},
            next=("message_checkpoint",),
            config={},
            metadata=checkpoint_metadata,
            created_at=datetime.now()
        )

        self.checkpointer.save_checkpoint(thread_id, state_snapshot)
        logger.info(f"Checkpoint saved: thread={thread_id}, id={checkpoint_id}, messages={len(messages)}")

        return checkpoint_id

    def restore_checkpoint(
        self,
        thread_id: str,
        checkpoint_id: Optional[str] = None,
    ) -> Optional[List[Message]]:
        snapshot = self.checkpointer.get_checkpoint(thread_id, checkpoint_id)

        if not snapshot:
            logger.warning(f"Checkpoint not found: thread={thread_id}, id={checkpoint_id}")
            return None

        try:
            messages_data = snapshot.values.get("messages", [])
            messages = [Message(**msg_data) for msg_data in messages_data]

            logger.info(f"Checkpoint restored: thread={thread_id}, id={checkpoint_id}, messages={len(messages)}")
            return messages

        except Exception as e:
            logger.error(f"Failed to restore checkpoint: {e}")
            return None

    def list_checkpoints(self, thread_id: str) -> List[Dict[str, Any]]:
        
        snapshots = self.checkpointer.list_checkpoints(thread_id)

        result = []
        for snapshot in snapshots:
            checkpoint_info = {
                "checkpoint_id": snapshot.metadata.get("checkpoint_id") or str(snapshot.created_at.timestamp()),
                "created_at": snapshot.created_at.isoformat(),
                "message_count": snapshot.metadata.get("message_count", 0),
                "metadata": snapshot.metadata
            }
            result.append(checkpoint_info)

        return result

    def clear_checkpoints(self, thread_id: str) -> None:
        
        self.checkpointer.clear_thread(thread_id)
        logger.info(f"Cleared checkpoints for thread: {thread_id}")
