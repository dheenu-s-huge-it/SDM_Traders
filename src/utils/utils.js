
const currentDate = new Date();
const formatted = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    currentDate.getDate()
);

const month = ("0" + (formatted.getMonth() + 1)).slice(-2);
const day = ("0" + formatted.getDate()).slice(-2);
const year = formatted.getFullYear().toString().slice(-2);

export const formattedDate = `${month}${day}${year}`;
export const formattedDate2 = `${month}${day}${year}`;