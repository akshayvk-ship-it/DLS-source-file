export default function copyToClipboard(text: string, onfulfilled: () => void) {
  navigator.clipboard
    .writeText(text)
    .then(onfulfilled)
    .catch(() => {});
}
