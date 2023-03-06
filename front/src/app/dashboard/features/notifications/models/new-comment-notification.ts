// todo: see how to share the types between notifications/ and /front

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
  id: string;
};
