import { Observable } from "rxjs";
import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { HelperService } from "../helper/helper.service";
import { CoreConfig } from "../helper/core.config";

@Injectable({
  providedIn: "root",
})
export class SellersService {
  private apiPath: string = "";

  constructor(private http: HttpClient, private helperService: HelperService) {
    this.apiPath = CoreConfig.getApiPath();
  }

  // Get Data
  public getData(query = {}): Observable<any> {
    const url = this.apiPath + '/sellers';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.get(url, { params: params });
  }

  // Create Data
  public createData(body?, imgUrl?, query = {}): Observable<any> {
    const url = this.apiPath + '/sellers';
    const params = this.helperService.objectToHttpParams(query);

    let formData = {
      'phone': body.phone,
      'username': body.username,
      'email': body.email,
      'address': body.address,
      'password': body.password
    };

    return this.http.post(url, formData, { params: params });
  }

  // Update Data
  public updateData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/sellers/'+id;
    const params = this.helperService.objectToHttpParams(query);

    return this.http.put(url, body, { params: params });
  }

  // Delete Data
  public deleteData(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/sellers/'+id;
    const params = this.helperService.objectToHttpParams(query);

    return this.http.request('delete', url, { params: params, body: body})
  }

  // Create Data
  public signupUser(body?, imgUrl?, query = {}): Observable<any> {
    const url = this.apiPath + '/sellers/signup';
    const params = this.helperService.objectToHttpParams(query);

    let formData = {
      'phone': body.phone,
      'username': body.username,
      'email': body.email,
      'address': body.address,
      'password': body.password
    };

    return this.http.post(url, formData, { params: params });
  }

  // Create Data
  public loginUser(user: string, password: string): Observable<any> {
    const url = this.apiPath + '/sellers/login';
    const body = { user, password };

    return this.http.post(url, body);
  }

  // Create Data
  public logoutUser(): Observable<any> {
    const url = this.apiPath + '/sellers/logout';

    return this.http.post(url, {});
  }

  // Update Data
  public changePassowrd(id, body?, query = {}): Observable<any> {
    const url = this.apiPath + '/sellers/'+id+'/changePassword';
    const params = this.helperService.objectToHttpParams(query);

    return this.http.put(url, body, { params: params });
  }
}
