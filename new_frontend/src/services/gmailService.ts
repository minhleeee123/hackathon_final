import { Email, GmailLabel } from '../types';

const API_BASE_URL = 'http://localhost:3002/api';

export async function fetchGmailEmails(maxResults: number = 50): Promise<Email[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails?maxResults=${maxResults}`);
    if (!response.ok) {
      throw new Error('Failed to fetch emails');
    }
    const data = await response.json();
    return data.emails.map((email: any) => ({
      ...email,
      date: new Date(email.date)
    }));
  } catch (error) {
    console.error('Error fetching Gmail emails:', error);
    throw error;
  }
}

export async function fetchGmailLabels(): Promise<{
  labels: GmailLabel[];
  systemLabels: GmailLabel[];
  userLabels: GmailLabel[];
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/labels`);
    if (!response.ok) {
      throw new Error('Failed to fetch labels');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching Gmail labels:', error);
    throw error;
  }
}

export async function starEmail(emailId: string, star: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/star`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ star }),
    });
    if (!response.ok) {
      throw new Error('Failed to star email');
    }
  } catch (error) {
    console.error('Error starring email:', error);
    throw error;
  }
}

export async function markAsRead(emailId: string, read: boolean): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/read`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ read }),
    });
    if (!response.ok) {
      throw new Error('Failed to mark email as read');
    }
  } catch (error) {
    console.error('Error marking email:', error);
    throw error;
  }
}

export async function deleteEmail(emailId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/delete`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to delete email');
    }
  } catch (error) {
    console.error('Error deleting email:', error);
    throw error;
  }
}

export async function sendEmail(to: string[], subject: string, body: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ to, subject, body }),
    });
    if (!response.ok) {
      throw new Error('Failed to send email');
    }
  } catch (error) {
    console.error('Error sending email:', error);
    throw error;
  }
}

export async function addLabelToEmail(emailId: string, labelIds: string | string[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/labels/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ labelIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to add label');
    }
  } catch (error) {
    console.error('Error adding label:', error);
    throw error;
  }
}

export async function removeLabelFromEmail(emailId: string, labelIds: string | string[]): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/emails/${emailId}/labels/remove`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ labelIds }),
    });
    if (!response.ok) {
      throw new Error('Failed to remove label');
    }
  } catch (error) {
    console.error('Error removing label:', error);
    throw error;
  }
}

export async function createLabel(name: string, color?: { backgroundColor: string; textColor: string }): Promise<GmailLabel> {
  try {
    const response = await fetch(`${API_BASE_URL}/labels/create`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ name, color }),
    });
    if (!response.ok) {
      throw new Error('Failed to create label');
    }
    const data = await response.json();
    return data.label;
  } catch (error) {
    console.error('Error creating label:', error);
    throw error;
  }
}

export async function deleteLabel(labelId: string): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/labels/${labelId}`, {
      method: 'DELETE',
    });
    if (!response.ok) {
      throw new Error('Failed to delete label');
    }
  } catch (error) {
    console.error('Error deleting label:', error);
    throw error;
  }
}

export async function initializeAILabels(): Promise<{
  success: boolean;
  created: Array<{ name: string; id: string; existed: boolean }>;
  existed: Array<{ name: string; id: string; existed: boolean }>;
  total: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/ai/init-labels`, {
      method: 'POST',
    });
    if (!response.ok) {
      throw new Error('Failed to initialize AI labels');
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error initializing AI labels:', error);
    throw error;
  }
}

/**
 * Find or create label by name
 * Tìm label theo tên, nếu chưa có thì tạo mới (không cần màu)
 */
export async function findOrCreateLabel(labelName: string): Promise<string> {
  try {
    // Get all existing labels
    const labelsData = await fetchGmailLabels();
    
    // Find label by name (case-insensitive)
    const existingLabel = labelsData.labels.find(
      l => l.name.toLowerCase() === labelName.toLowerCase()
    );
    
    if (existingLabel) {
      console.log(`✅ Label "${labelName}" already exists: ${existingLabel.id}`);
      return existingLabel.id;
    }
    
    // Label doesn't exist, create it without color (use Gmail default)
    console.log(`📝 Creating new label: "${labelName}"`);
    const newLabel = await createLabel(labelName); // No color parameter
    console.log(`✅ Label created: ${newLabel.id}`);
    return newLabel.id;
  } catch (error) {
    console.error(`Error finding/creating label "${labelName}":`, error);
    throw error;
  }
}

/**
 * Add label to email by label name (not ID)
 * Tự động tìm hoặc tạo label nếu chưa có
 */
export async function addLabelToEmailByName(emailId: string, labelName: string): Promise<void> {
  try {
    const labelId = await findOrCreateLabel(labelName);
    await addLabelToEmail(emailId, labelId);
    console.log(`✅ Added label "${labelName}" to email ${emailId}`);
  } catch (error) {
    console.error(`Error adding label "${labelName}" to email:`, error);
    throw error;
  }
}

/**
 * Add multiple labels to email by names
 */
export async function addLabelsToEmailByNames(emailId: string, labelNames: string[]): Promise<void> {
  try {
    const labelIds: string[] = [];
    
    for (const labelName of labelNames) {
      const labelId = await findOrCreateLabel(labelName);
      labelIds.push(labelId);
    }
    
    await addLabelToEmail(emailId, labelIds);
    console.log(`✅ Added ${labelIds.length} labels to email ${emailId}`);
  } catch (error) {
    console.error('Error adding labels to email:', error);
    throw error;
  }
}
