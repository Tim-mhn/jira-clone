import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MockAPI } from '@tim-mhn/common/http';
import { environment } from '../../../environments/environment';
import {
  AcceptInvitationInputDTO,
  AcceptInvitationOutputDTO,
} from '../dtos/invitations.dtos';
import { ProjectInvitationsProvidersModule } from '../invitations.providers.module';

@Injectable({
  providedIn: ProjectInvitationsProvidersModule,
})
export class InvitationsAPI {
  constructor(private mock: MockAPI, private http: HttpClient) {}

  private readonly ENDPOINT = `${environment.apiUrl}projects/invitation/accept`;
  acceptInvitation(dto: AcceptInvitationInputDTO) {
    // return this.mock.post<AcceptInvitationInputDTO, void>(dto, null);
    return this.http.post<AcceptInvitationOutputDTO>(this.ENDPOINT, dto);
  }
}
