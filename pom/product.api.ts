import { APIRequestContext, APIResponse } from '@playwright/test';

export class ProductAPI {
  constructor(private request: APIRequestContext) {}

  async createProduct(data: { title: string; price: number; stock: number }): Promise<APIResponse> {
    // DummyJSON’s add endpoint returns 201 Created (but status varies) 
    return this.request.post(`${process.env.BASE_URL}/products/add`, { data });
  }

  async getProduct(id: number): Promise<APIResponse> {
    return this.request.get(`${process.env.BASE_URL}/products/${id}`);
  }

  async updateProduct(id: number, update: Partial<{ price: number }>): Promise<APIResponse> {
    return this.request.put(`${process.env.BASE_URL}/products/${id}`, { data: update });
  }

  async deleteProduct(id: number): Promise<APIResponse> {
    return this.request.delete(`${process.env.BASE_URL}/products/${id}`);
  }
}
