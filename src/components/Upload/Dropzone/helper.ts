export default function getFileExtension(file: File) {
  const matches = file?.name.match(/[0-9a-z]+$/);
  return matches ? matches[0] : null;
}
