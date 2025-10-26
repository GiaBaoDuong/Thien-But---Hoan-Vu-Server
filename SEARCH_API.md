# API Tìm kiếm Products và Promotions

## Tổng quan
API này cung cấp các tính năng tìm kiếm và lọc nâng cao cho Products và Promotions với nhiều tiêu chí khác nhau.

## 🔍 Products Search API

### Endpoint
**GET** `/products/search`

### Tham số tìm kiếm

| Tham số | Loại | Bắt buộc | Mô tả | Ví dụ |
|---------|------|----------|-------|-------|
| `name` | string | Không | Tìm kiếm theo tên sản phẩm (không phân biệt hoa thường) | `laptop` |
| `companyId` | number | Không | Lọc theo ID công ty | `1` |
| `is_published` | boolean | Không | Lọc sản phẩm đã xuất bản | `true` |
| `is_featured` | boolean | Không | Lọc sản phẩm nổi bật | `true` |
| `is_deleted` | boolean | Không | Lọc sản phẩm đã bị xóa (mặc định: false) | `false` |

### Ví dụ sử dụng

#### Tìm kiếm sản phẩm theo tên
```bash
GET /products/search?name=laptop
```

#### Lọc sản phẩm theo công ty
```bash
GET /products/search?companyId=1
```

#### Tìm sản phẩm nổi bật đã xuất bản
```bash
GET /products/search?is_featured=true&is_published=true
```

#### Kết hợp nhiều điều kiện
```bash
GET /products/search?name=laptop&companyId=1&is_published=true
```

### Response
```json
{
  "statusCode": 200,
  "message": "Tìm kiếm sản phẩm thành công",
  "data": [
    {
      "id": 1,
      "name": "Laptop Gaming",
      "slug": "laptop-gaming",
      "price": 15000000,
      "sale_price": 12000000,
      "is_published": true,
      "is_featured": true,
      "is_deleted": false,
      "images": [
        {
          "id": 1,
          "imageUrl": "http://localhost:8080/uploads/productsImages/image1.jpg",
          "order": 0
        }
      ],
      "category": {
        "id": 1,
        "name": "Điện tử"
      },
      "brand": {
        "id": 1,
        "name": "ASUS"
      },
      "company": {
        "id": 1,
        "name": "Công ty ABC"
      }
    }
  ]
}
```

## 🎯 Promotions Search API

### Endpoint
**GET** `/promotions/search`

### Tham số tìm kiếm

| Tham số | Loại | Bắt buộc | Mô tả | Ví dụ |
|---------|------|----------|-------|-------|
| `name` | string | Không | Tìm kiếm theo tên promotion (không phân biệt hoa thường) | `khuyến mãi` |
| `companyId` | number | Không | Lọc theo ID công ty | `1` |
| `isActive` | boolean | Không | Lọc promotion đang active | `true` |
| `startDateFrom` | date | Không | Lọc promotion từ ngày bắt đầu | `2024-01-01` |
| `startDateTo` | date | Không | Lọc promotion đến ngày bắt đầu | `2024-12-31` |
| `endDateFrom` | date | Không | Lọc promotion từ ngày kết thúc | `2024-01-01` |
| `endDateTo` | date | Không | Lọc promotion đến ngày kết thúc | `2024-12-31` |

### Ví dụ sử dụng

#### Tìm kiếm promotion theo tên
```bash
GET /promotions/search?name=khuyến mãi
```

#### Lọc promotion theo công ty
```bash
GET /promotions/search?companyId=1
```

#### Tìm promotion đang active
```bash
GET /promotions/search?isActive=true
```

#### Lọc promotion theo khoảng thời gian
```bash
GET /promotions/search?startDateFrom=2024-01-01&startDateTo=2024-12-31
```

#### Kết hợp nhiều điều kiện
```bash
GET /promotions/search?name=khuyến mãi&companyId=1&isActive=true&startDateFrom=2024-01-01
```

### Response
```json
{
  "statusCode": 200,
  "message": "Tìm kiếm promotion thành công",
  "data": [
    {
      "id": 1,
      "name": "Khuyến mãi mùa hè",
      "description": "Giảm giá 20% cho tất cả sản phẩm",
      "discountType": "PERCENTAGE",
      "discountValue": 20,
      "startDate": "2024-06-01T00:00:00.000Z",
      "endDate": "2024-08-31T23:59:59.000Z",
      "isActive": true,
      "products": [
        {
          "id": 1,
          "name": "Laptop Gaming",
          "images": [...],
          "category": {...},
          "brand": {...}
        }
      ],
      "company": {
        "id": 1,
        "name": "Công ty ABC"
      }
    }
  ]
}
```

## 🚀 Tính năng nổi bật

### 1. **Tìm kiếm thông minh**
- Tìm kiếm theo tên không phân biệt hoa thường
- Hỗ trợ tìm kiếm một phần (partial search)
- Kết hợp nhiều điều kiện lọc

### 2. **Lọc theo trạng thái**
- Products: published, featured, deleted
- Promotions: active, thời gian bắt đầu/kết thúc

### 3. **Lọc theo công ty**
- Chỉ lấy dữ liệu của công ty cụ thể
- Hỗ trợ multi-tenant architecture

### 4. **Sắp xếp kết quả**
- Tự động sắp xếp theo thời gian tạo (mới nhất trước)
- Bao gồm thông tin liên quan (images, category, brand, company)

## 📝 Lưu ý

- Tất cả tham số tìm kiếm đều là **tùy chọn**
- Có thể kết hợp nhiều điều kiện lọc
- Kết quả được sắp xếp theo thời gian tạo (mới nhất trước)
- Bao gồm thông tin liên quan để giảm số lượng API calls

## 🔧 Ví dụ sử dụng với cURL

### Tìm kiếm sản phẩm
```bash
# Tìm sản phẩm có tên chứa "laptop"
curl "http://localhost:8080/products/search?name=laptop"

# Lọc sản phẩm của công ty ID 1
curl "http://localhost:8080/products/search?companyId=1"

# Tìm sản phẩm nổi bật đã xuất bản
curl "http://localhost:8080/products/search?is_featured=true&is_published=true"
```

### Tìm kiếm promotion
```bash
# Tìm promotion có tên chứa "khuyến mãi"
curl "http://localhost:8080/promotions/search?name=khuyến mãi"

# Lọc promotion đang active của công ty ID 1
curl "http://localhost:8080/promotions/search?companyId=1&isActive=true"

# Tìm promotion trong khoảng thời gian
curl "http://localhost:8080/promotions/search?startDateFrom=2024-01-01&endDateTo=2024-12-31"
```
