export default interface HttpResponse<T> {
  status: number;
  data: T;
};
