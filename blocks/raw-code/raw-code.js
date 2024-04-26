export default async function decorate(block) {
  const code = block.querySelector('p');
  block.append(code);
}
