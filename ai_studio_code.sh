# Khởi tạo git nếu chưa có
git init -b main

# Thêm tất cả các file vào staging
git add .

# Tạo commit đầu tiên
git commit -m "Initial commit of AI Photo Editor"

# Kết nối với repository trên GitHub
git remote add origin https://github.com/nguyenphuchai88-star/ai-photo-editor.git

# Đẩy mã nguồn lên branch main
git push -u origin main