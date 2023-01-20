import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { MockAPI } from '@tim-mhn/common/http';
import { environment } from '../../../environments/environment';
import { buildSingleProjectEndpoint } from '../../dashboard/core/apis/endpoints';
import { ProjectId } from '../../dashboard/core/models';
import {
  AcceptInvitationInputDTO,
  AcceptInvitationOutputDTO,
} from '../dtos/invitations.dtos';
import { ProjectInvitationsProvidersModule } from '../invitations.providers.module';
import { InvitationEmailList } from '../models/invitation-email';

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

  sendInvitation(projectId: ProjectId, guestEmails: InvitationEmailList) {
    const endpoint = this._buildSendInvitationEndpoint(projectId);
    const body = {
      guestEmails,
    };
    return this.http.post<string>(endpoint, body);
  }

  private _buildSendInvitationEndpoint(projectId: ProjectId) {
    const singleProjectEndpoint = buildSingleProjectEndpoint(projectId);
    return `${singleProjectEndpoint}/members/invite`;
  }
}
