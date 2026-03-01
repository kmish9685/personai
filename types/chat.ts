export type MessageRole = 'user' | 'assistant' | 'system';

export interface Message {
    role: MessageRole;
    content: string;
    reasoning?: string; // New: reasoning for single mode
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
}

export interface ChatRequest {
    messages: Message[];
    mode?: 'single' | 'multi'; // New: support multi-persona mode
    persona?: string; // For single mode
    history?: { role: string; content: string }[];
}

export interface PersonaResponse {
    personaId: string;
    personaName: string;
    response: string;
    reasoning?: string; // New: reasoning breakdown
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
}

export interface ChatResponse {
    response?: string; // For single mode
    reasoning?: string; // New: reasoning for single mode
    assumptions?: string;
    missingData?: string;
    preMortem?: string;
    biasCheck?: string;
    responses?: PersonaResponse[]; // For multi mode
    mode: 'single' | 'multi';
    remaining_free?: number;
    plan?: string;
}
