export interface Mapper<Domain, DTO> {
  toDomain?(dto: DTO, ...args: any[]): Domain;
  toDTO?(domain: Domain, ...args: any[]): DTO;
}
