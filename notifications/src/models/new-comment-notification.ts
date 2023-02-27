export type NewCommentNotification = {
  taskId: string;
  project: {
    id: string;
    name: string;
  };
  comment: string;
  author: {
    name: string;
    id: string;
  };
};
