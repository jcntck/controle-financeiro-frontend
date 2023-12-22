const mappedErrors = new Map([
  [
    'Category already exists with this name or color',
    'Categoria já existe com este nome ou coloração escolhida',
  ],
]);

export default class ServerErrorsMapper {
  static getTranslatedMessage(message: string): string {
    return (
      mappedErrors.get(message) ||
      'Um erro inexperado aconteceu, tente novamente.'
    );
  }
}
