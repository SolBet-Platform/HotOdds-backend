export function formatDate(date: Date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
  
    return `${year}-${month}-${day}`;
  }
  
  export function addDays(date:Date, days: number) {
    const result = new Date(date);
    result.setDate(result.getDate() + days);
    const year = result.getFullYear()
    const month = String(result.getMonth() + 1).padStart(2, '0')
    const day = String(result.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;  }
  
  // Example usage: add 14 days to the current date
//   const currentDate = new Date();
//   const newDate = addDays(currentDate, 14);
  
//   console.log(formatDate(newDate)); // Outputs the date 14 days from today in YYYY-MM-DD format
  