import { Injectable } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { Observable } from 'rxjs/internal/Observable';
import { HttpClient } from '@angular/common/http';
import { map } from 'rxjs/internal/operators/map';
import { PageQuery } from '../../../shared/adif-data-table/data-table/data-table.component';

export interface Budget {
  codigo_sap_expediente: string;
  cod_sociedad: string;
}

export interface ResponseProvisionesAsscodas {
  key: {
    codigo: string;
    cod_sociedad: string;
    periodo?: number;
  };
  timestamp?: number;
}

export interface ProvisionesAsscodas {
  codigo_sap_expediente: string;
  cod_sociedad: string;
  periodo?: number;
  timestamp?: number;
}

export interface ProvisionesContent {
  content: ProvisionesAsscodas[];
  numberOfElements: number;
  totalElements: number;
}

export interface SearchProvisiones {
  codigo: string;
  page: number;
  size: number;
  timestamp: number;
}

@Injectable({
  providedIn: 'root'
})
export class ProvisionesAsscoadasService {
  userSelection: ProvisionesAsscodas;
  private readonly allActionsUri = environment.serverUrl + '/adif/contables';
  private readonly listAllUri = environment.serverUrl + '/adif/codigo/';
  private readonly saveUri = environment.serverUrl + '/adif/codigo';
  private readonly searchUri = environment.serverUrl + '/adif/codigo/search/';
  private readonly searchCodigoUri = environment.serverUrl + '/adif/codigo/autosearch/';
  private readonly deleteCodigoUri = environment.serverUrl + '/adif/codigo/';
  constructor(
    private http: HttpClient
  ) { }

  userSelectedRow(row) {
    this.userSelection = row;
  }

  getUserSelection() {
    return this.userSelection;
  }

  save(data: ProvisionesAsscodas) {
    return this.http.post<ProvisionesContent>(this.saveUri, data);
  }

  listAll(tstamp, pageQuery: PageQuery): Observable<ProvisionesContent> {
    return this.http.get<ProvisionesContent>(this.listAllUri + tstamp + '/' + pageQuery.pageIndex + '/' + pageQuery.pageSize);
  }

  searchCodigo(search): Observable<Budget> {
    return this.http.get<Budget>(this.searchCodigoUri + search);
  }

  searchWithDate(data: SearchProvisiones): Observable<ProvisionesContent> {
    return this.http.post<ProvisionesContent>(this.searchUri, data);
  }

  delete(data: ResponseProvisionesAsscodas): Observable<any> {
    return this.http.delete(this.deleteCodigoUri + data.key.codigo + '/' + data.key.cod_sociedad + '/' + data.timestamp);
  }
}
