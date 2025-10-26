# API Quản lý Products trong Promotion

## Tổng quan
API này cho phép bạn quản lý việc thêm, xóa và lấy danh sách sản phẩm trong các chương trình khuyến mãi.

## Các Endpoint

### 1. Thêm Products vào Promotion
**PUT** `/promotions/:id/products`

Thêm một hoặc nhiều sản phẩm vào chương trình khuyến mãi.

**Request Body:**
```json
{
  "productIds": [1, 2, 3]
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Thêm sản phẩm vào promotion thành công",
  "data": null
}
```

### 2. Xóa Products khỏi Promotion
**DELETE** `/promotions/:id/products`

Xóa một hoặc nhiều sản phẩm khỏi chương trình khuyến mãi.

**Request Body:**
```json
{
  "productIds": [1, 2]
}
```

**Response:**
```json
{
  "statusCode": 200,
  "message": "Xóa sản phẩm khỏi promotion thành công",
  "data": null
}
```

### 3. Lấy danh sách Products trong Promotion
**GET** `/promotions/:id/products`

Lấy danh sách tất cả sản phẩm trong chương trình khuyến mãi.

**Response:**
```json
{
  "statusCode": 200,
  "message": "Lấy danh sách sản phẩm trong promotion thành công",
  "data": [
    {
      "id": 1,
      "name": "Sản phẩm A",
      "slug": "san-pham-a",
      "price": 100000,
      "sale_price": 80000,
      "images": [
        {
          "id": 1,
          "imageUrl": "http://localhost:8080/uploads/productsImages/image1.jpg",
          "order": 0
        }
      ],
      "category": {
        "id": 1,
        "name": "Danh mục A"
      },
      "brand": {
        "id": 1,
        "name": "Thương hiệu A"
      }
    }
  ]
}
```

## Lưu ý
- **Validation nghiêm ngặt**: Hệ thống sẽ kiểm tra Promotion ID trước, chỉ khi promotion tồn tại và đang active mới cho phép thao tác với products
- **Kiểm tra sản phẩm**: Chỉ cho phép thêm sản phẩm chưa bị xóa và chưa có trong promotion
- **Tránh trùng lặp**: Không thể thêm sản phẩm đã có trong promotion
- **Thông báo lỗi rõ ràng**: Mỗi lỗi sẽ có thông báo cụ thể về nguyên nhân
- **Có thể thêm/xóa nhiều sản phẩm cùng lúc**
- **Khi lấy danh sách sản phẩm, sẽ bao gồm thông tin ảnh, danh mục và thương hiệu**

## Các trường hợp lỗi có thể xảy ra:

### Khi thêm sản phẩm:
- `404`: Promotion không tồn tại
- `400`: Promotion đã bị vô hiệu hóa
- `404`: Một số sản phẩm không tồn tại hoặc đã bị xóa
- `400`: Tất cả sản phẩm đã có trong promotion

### Khi xóa sản phẩm:
- `404`: Promotion không tồn tại
- `400`: Không có sản phẩm nào trong danh sách thuộc promotion này

## Ví dụ sử dụng với cURL

### Thêm sản phẩm vào promotion
```bash
curl -X PUT "http://localhost:8080/promotions/1/products" \
  -H "Content-Type: application/json" \
  -d '{"productIds": [1, 2, 3]}'
```

### Xóa sản phẩm khỏi promotion
```bash
curl -X DELETE "http://localhost:8080/promotions/1/products" \
  -H "Content-Type: application/json" \
  -d '{"productIds": [1, 2]}'
```

### Lấy danh sách sản phẩm trong promotion
```bash
curl -X GET "http://localhost:8080/promotions/1/products"
```
