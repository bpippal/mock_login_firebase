import dayjs from 'dayjs';

export const getCurrentJST = () => {
  // TODO format must be 'YYYY-MM-DD HH:mm:ss'
  const now = new Date();
  return formatDate(now);
};

export const getAddToCurrentJST = (num: number, unit: dayjs.ManipulateType) => {
  // TODO
  const now = new Date()
  now.setHours(now.getHours() + 1);
  return formatDate(now);
};

export const isAfterCurrentJST = (time: string) => {
  // TODO
};

function formatDate(date : Date){

  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0');
  const day = String(date.getDate()).padStart(2, '0');
  const hours = String(date.getHours()).padStart(2, '0');
  const minutes = String(date.getMinutes()).padStart(2, '0');
  const seconds = String(date.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day} ${hours}:${minutes}:${seconds}`;
}
