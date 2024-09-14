import axios from 'axios';

const API_URL = '/api/suppliers/';

const getSuppliers = async () => {
  const response = await axios.get(API_URL);
  return response.data;
};

const createSupplier = async (supplierData) => {
  const response = await axios.post( `${API_URL}add`, supplierData, { withCredentials: true });
  return response.data;
};

const addTransaction = async (supplierId, transactionData) => {
    const response = await axios.post(`${API_URL}${supplierId}/transaction`, transactionData, { withCredentials: true });
  return response.data;
};

const supplierService = {
  getSuppliers,
  createSupplier,
  addTransaction,
};

export default supplierService;