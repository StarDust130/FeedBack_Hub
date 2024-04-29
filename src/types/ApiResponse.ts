import { Message } from '@/model/User';

export interface ApiResponse {
    [x: string]: never[];
    success: boolean;
    message: string;
    isAcceptingMessages?: boolean;
    meesaage?: Array<Message>;
}


