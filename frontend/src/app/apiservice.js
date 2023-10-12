import axios from "axios";

const httpCliente = axios.create({
    baseURL: 'http://localhost:8080'
})

class ApiService{

    constructor(apiurl){
        this.apiurl = apiurl;
    }

    get(url){
        const requestUrl = `${this.apiurl}${url}`
        return httpCliente.get(requestUrl)
    }

    post(url, objeto){
        const requestUrl = `${this.apiurl}${url}`
        return httpCliente.post(requestUrl, objeto)
    }

    put(url, objeto){
        const requestUrl = `${this.apiurl}${url}`
        return httpCliente.put(requestUrl, objeto)
    }

    delete(url){
        const requestUrl = `${this.apiurl}${url}`
        return httpCliente.delete(requestUrl)
    }

}

export default ApiService