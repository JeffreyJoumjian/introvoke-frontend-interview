import { APIController } from './APIController';

// MOCKING HTML FUNCTIONS
export const mockScrollIntoView = (window.HTMLElement.prototype.scrollIntoView = jest.fn());

// MOCKING API FUNCTIONS
export const mockGetAllMessages = (APIController.getAllMessages = jest.fn());
export const mockSendMessage = (APIController.sendMessage = jest.fn());