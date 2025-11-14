import os
import logging
import smtplib
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from typing import List, Dict, Any, Optional
from dotenv import load_dotenv

logger = logging.getLogger(__name__)

class EmailNotifier:
    """Email notification sender for monitoring alerts"""
    
    def __init__(self):
        self.config = self._load_config()
    
    def _load_config(self) -> Dict[str, Any]:
        """Load email configuration from environment variables"""
        load_dotenv()
        
        config = {
            "smtp_server": os.getenv("EMAIL_SMTP_SERVER"),
            "smtp_port": int(os.getenv("EMAIL_SMTP_PORT", "587")),
            "smtp_user": os.getenv("EMAIL_SMTP_USER"),
            "smtp_password": os.getenv("EMAIL_SMTP_PASSWORD"),
            "from_email": os.getenv("EMAIL_FROM"),
            "default_recipients": [
                email.strip() for email in os.getenv("EMAIL_DEFAULT_RECIPIENTS", "").split(",") if email.strip()
            ]
        }
        
        # Validate required configuration items
        missing = []
        for key in ["smtp_server", "smtp_user", "smtp_password"]:
            if not config.get(key):
                missing.append(key)
        
        if missing:
            logger.warning(f"Missing email configuration: {', '.join(missing)}")
        
        return config
    
    def send(self, message: str, to_emails: Optional[List[str]] = None,
             subject: str = "Crypto Monitoring Alert", 
             html_format: bool = True, **kwargs) -> bool:
        """
        Send email notification
        
        Args:
            message: Email content
            to_emails: List of recipients, uses default recipients if None
            subject: Email subject
            html_format: Whether to send in HTML format
            **kwargs: Other SMTP parameters
        
        Returns:
            bool: Whether the send was successful
        """
        # Get SMTP configuration
        smtp_server = self.config.get("smtp_server")
        smtp_port = self.config.get("smtp_port", 587)
        smtp_user = self.config.get("smtp_user")
        smtp_password = self.config.get("smtp_password")
        
        if not all([smtp_server, smtp_user, smtp_password]):
            logger.error("SMTP configuration is incomplete")
            return False
        
        # Determine sender and recipients
        from_email = kwargs.get("from_email") or self.config.get("from_email", smtp_user)
        recipients = to_emails or self.config.get("default_recipients", [])
        
        if not recipients:
            logger.error("No recipients specified for email")
            return False
        
        try:
            # Create email
            msg = MIMEMultipart()
            msg['From'] = from_email
            msg['To'] = ", ".join(recipients)
            msg['Subject'] = subject
            
            # Add content
            if html_format:
                # If message already contains HTML tags, use it directly
                if not (message.startswith('<') and message.endswith('>')):
                    # Convert newlines to <br>
                    message = message.replace('\n', '<br>')
                    # Add basic HTML structure
                    message = f"""
                    <html>
                    <body>
                    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                        {message}
                    </div>
                    </body>
                    </html>
                    """
                msg.attach(MIMEText(message, 'html'))
            else:
                msg.attach(MIMEText(message, 'plain'))
            
            # Connect to SMTP server
            with smtplib.SMTP(smtp_server, smtp_port) as server:
                server.starttls()
                server.login(smtp_user, smtp_password)
                
                # Send email
                server.send_message(msg)
            
            logger.info(f"Email sent successfully to {recipients}")
            return True
            
        except Exception as e:
            logger.error(f"Failed to send email: {str(e)}")
            return False