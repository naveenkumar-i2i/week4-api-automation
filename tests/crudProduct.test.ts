import { test, expect, request } from '@playwright/test';
import dotenv from 'dotenv';
import { ProductAPI } from '../pom/product.api';
import { createProductSchema, productSchema } from '../utils/schema.validator';

dotenv.config();

test.describe('Task 2: CRUD Lifecycle (DummyJSON adaptation)', () => {
  let apiContext;
  let api: ProductAPI;
  let createdId: number;

  test.beforeAll(async () => {
    apiContext = await request.newContext();
    api = new ProductAPI(apiContext);
  });

  test('Create → Read → Update → Delete (adapted)', async () => {
    // 1. Create (expect 200 or 201)
    const createResp = await api.createProduct({ title: 'Test Item', price: 99, stock: 10 });
    expect([200, 201]).toContain(createResp.status());

    const created = await createResp.json();
    createdId = created.id;
    expect(createdId).toBeGreaterThan(0);
    expect(createProductSchema.safeParse(created).success).toBeTruthy();

    // 2. Read (expect 404, since DummyJSON doesn’t persist new items)
    const getResp = await api.getProduct(createdId);
    expect(getResp.status()).toBe(404);

    // 3. Update (expect 404 for non-existent resource)
    const updateResp = await api.updateProduct(createdId, { price: 79 });
    expect(updateResp.status()).toBe(404);

    // 4. Delete (expect 404 for non-existent resource)
    const deleteResp = await api.deleteProduct(createdId);
    expect(deleteResp.status()).toBe(404);
  });

  test.afterAll(async () => {
    await apiContext.dispose();
  });
});
