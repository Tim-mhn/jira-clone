export class NotificationNotFound extends Error {
  constructor(id: string) {
    super(`Notification ${id} not found`);
  }
}
