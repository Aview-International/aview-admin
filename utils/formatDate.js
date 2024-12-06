const defaultDateOptions = {
  hour: '2-digit',
  minute: '2-digit',
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour12: true,
};

export const formatTimestamp = (timestamp, options = defaultDateOptions) => {
  try {
    const date = new Date(+timestamp);
    return date.toLocaleString('en-US', options);
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid Date';
  }
};
