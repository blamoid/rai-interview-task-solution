const ONLY_IMAGE_RULE = (value: File[]) =>
  !value ||
  value.every((file) => file.type.includes('image/')) ||
  'Invalid file type. Only image is allowed';

const REQUIRED_FILE_RULE = (v: File[]) => v.length > 0 || 'This field is required';

export { ONLY_IMAGE_RULE, REQUIRED_FILE_RULE };
