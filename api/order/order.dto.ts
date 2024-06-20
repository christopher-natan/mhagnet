export class OrderDto {
  referenceCode: string;

  createReferenceCode() {
    this.referenceCode = '';
  }
}
