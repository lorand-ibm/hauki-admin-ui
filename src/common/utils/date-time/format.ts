import parse from 'date-fns/parse';
import format from 'date-fns/format';

export const formatDate = (date: string): string =>
  new Date(date).toLocaleDateString();

export const formatDateRange = ({
  startDate,
  endDate,
}: {
  startDate: string;
  endDate: string;
}): string => {
  const isSingleDate: boolean = !endDate || startDate === endDate;
  const formattedStartDate: string = formatDate(startDate);
  if (isSingleDate) {
    return formattedStartDate;
  }
  return `${formattedStartDate} - ${formatDate(endDate)}`;
};

export const dateApiFormat = 'yyyy-MM-dd';
export const dateFormFormat = 'dd.MM.yyyy';
export const datetimeFormFormat = `${dateFormFormat} HH:mm`;
export const transformToApiFormat = (formDate: string): string =>
  format(parse(formDate, dateFormFormat, new Date()), dateApiFormat);
