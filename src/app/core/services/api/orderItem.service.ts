import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient, HttpHeaders } from "@angular/common/http";
import { HelperService } from "../helper/helper.service";
import { CoreConfig } from "../helper/core.config";
import { AuthService } from "../helper/auth.service";

@Injectable({
  providedIn: "root",
})
export class OrderItemService {
  private apiPath: string = "";

  constructor(
    private http: HttpClient,
    private helperService: HelperService,
    private authService: AuthService
  ) {
    this.apiPath = CoreConfig.getApiPath();
  }

  // Get Data
  public getData(query = {}): Observable<any> {
    const url = this.apiPath + '/orderItem';
    const params = this.helperService.objectToHttpParams(query);
    const token = this.authService.getLoginToken();

    return this.http.get(url, {
      params: params,
      headers: new HttpHeaders().set('Authorization',  token)
    });
  }

  // Create Data
  public createData(body?, query = {}): Observable<any> {
    const url = this.apiPath + '/orderItem';
    const params = this.helperService.objectToHttpParams(query);
    const token = this.authService.getLoginToken();

    return this.http.post(url, body, {
      params: params,
      headers: new HttpHeaders().set('Authorization',  token)
    });
  }

  // Update Data
  public updateData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/orderItem/'+id;
    const params = this.helperService.objectToHttpParams(query);
    const token = this.authService.getLoginToken();

    return this.http.put(url, body, {
      params: params,
      headers: new HttpHeaders().set('Authorization',  token)
    });
  }

  // Delete Data
  public deleteData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/orderItem/'+id;
    const params = this.helperService.objectToHttpParams(query);
    const token = this.authService.getLoginToken();

    return this.http.request('delete', url, {
      params: params,
      body: body,
      headers: new HttpHeaders().set('Authorization',  token)
    })
  }

  // Delete Data
  public deleteMany(body?, query = {}): Observable<any> {
    const url = this.apiPath + '/orderItem/deleteMany';
    const params = this.helperService.objectToHttpParams(query);
    const token = this.authService.getLoginToken();

    return this.http.request('delete', url, {
      params: params,
      body: body,
      headers: new HttpHeaders().set('Authorization',  token)
    })
  }
}
