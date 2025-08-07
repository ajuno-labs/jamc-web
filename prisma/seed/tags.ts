import { prisma } from "./utils";

const vietnameseGrade10MathTags = [
  // Đại số (Algebra)
  { name: "Đại số", description: "Đại số cơ bản, phương trình, bất đẳng thức" },
  { name: "Phương trình", description: "Giải phương trình bậc nhất, bậc hai và hệ phương trình" },
  { name: "Bất đẳng thức", description: "Giải bất đẳng thức và hệ bất đẳng thức" },
  { name: "Hàm số", description: "Khái niệm hàm số, tính chất và đồ thị" },
  { name: "Hàm bậc nhất", description: "Hàm số bậc nhất y = ax + b" },
  { name: "Hàm bậc hai", description: "Hàm số bậc hai y = ax² + bx + c" },
  
  // Hình học (Geometry)
  { name: "Hình học", description: "Hình học phẳng và không gian" },
  { name: "Vectơ", description: "Vectơ trong mặt phẳng, phép toán vectơ" },
  { name: "Tích vô hướng", description: "Tích vô hướng của hai vectơ" },
  { name: "Phương trình đường thẳng", description: "Phương trình tham số và tổng quát của đường thẳng" },
  { name: "Phương trình đường tròn", description: "Phương trình đường tròn và các bài toán liên quan" },
  { name: "Góc tam giác", description: "Các loại góc, tam giác và tính chất" },
  
  // Lượng giác (Trigonometry)
  { name: "Lượng giác", description: "Hàm số lượng giác và các công thức" },
  { name: "Sin Cos Tan", description: "Các hàm số sin, cos, tan và cot" },
  { name: "Công thức lượng giác", description: "Các công thức cộng, nhân đôi, hạ bậc" },
  { name: "Phương trình lượng giác", description: "Giải phương trình lượng giác cơ bản" },
  
  // Thống kê và xác suất (Statistics and Probability)
  { name: "Thống kê", description: "Thống kê mô tả, biểu đồ, bảng tần số" },
  { name: "Xác suất", description: "Xác suất cơ bản, quy tắc cộng và nhân" },
  { name: "Tổ hợp", description: "Hoán vị, chỉnh hợp, tổ hợp" },
  
  // Giải tích (Analysis)
  { name: "Giới hạn", description: "Giới hạn của dãy số và hàm số" },
  { name: "Đạo hàm", description: "Đạo hàm và ứng dụng" },
  { name: "Ứng dụng đạo hàm", description: "Khảo sát hàm số, tiếp tuyến" },
  
  // Các chủ đề chung
  { name: "Toán 10", description: "Toán học lớp 10 THPT" },
  { name: "THPT", description: "Trung học phổ thông" },
  { name: "Bài tập", description: "Bài tập và lời giải chi tiết" },
  { name: "Ôn tập", description: "Ôn tập và củng cố kiến thức" },
  { name: "Kiểm tra", description: "Đề kiểm tra và thi học kỳ" },
  { name: "Chuyên đề", description: "Các chuyên đề nâng cao" }
];

export async function seedTags() {
  console.log("🌱 Seeding Vietnamese Grade 10 Math tags...");
  
  try {
    // Upsert each tag (create if not exists, update if exists)
    const createdTags = [];
    
    for (const tag of vietnameseGrade10MathTags) {
      const result = await prisma.tag.upsert({
        where: { name: tag.name },
        update: { 
          description: tag.description,
          verified: true 
        },
        create: {
          name: tag.name,
          description: tag.description,
          aiGenerated: false,
          verified: true
        }
      });
      createdTags.push(result);
    }
    
    console.log(`✅ Successfully seeded ${createdTags.length} Vietnamese Grade 10 Math tags`);
    return createdTags;
    
  } catch (error) {
    console.error("❌ Error seeding tags:", error);
    throw error;
  }
}