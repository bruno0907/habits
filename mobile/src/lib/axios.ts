import axios from "axios";

const baseURL = 'http://192.168.1.159:3333'

export const api = axios.create({ baseURL })