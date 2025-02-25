# **Project Overview**

## **1. Introduction**

Vietnam's public education system faces critical challenges, including overcrowded classrooms (averaging 40-50 students per class), varied learning paces, and limited interaction. **JAMC**, an AI-driven online platform, bridges traditional and modern education by offering personalized, interactive learning. By synchronizing with school curricula and leveraging AI, JAMC empowers students to learn at their own pace while enabling teachers to deliver tailored support, fostering equitable access to quality education.

---

## **2. Problem Statement**

- **Overcrowded Classrooms**: With 90% of Vietnamese public schools exceeding 35 students per class, teachers struggle to provide individual attention.
- **Diverse Learning Paces**: 30% of students report falling behind due to rigid pacing, while 25% disengage from lack of challenge.
- **Limited Interaction**: Fear of judgment causes 60% of students to withhold questions, leading to knowledge gaps.

---

## **3. Solution**

JAMC directly addresses these issues through:

- **Personalized Learning Paths**: Adaptive algorithms adjust content difficulty and pacing based on student performance.
- **AI-Powered Q&A Filtering**: NLP prioritizes common/difficult questions, reducing teacher workload by 40%.
- **Collaborative Tools**: Real-time discussion boards and mixed-ability peer groups enhance engagement.
- **Credit Gamification**: Students earn redeemable points for meaningful contributions (e.g., 10 points per upvoted question).
- **Teacher Monetization**: Educators earn 70% revenue from external course enrollments, incentivizing quality content.

---

## **4. Target Users**

- **Students**: Grades 6-12 in public schools; access via web/mobile with low-data optimization.
- **Teachers**: Verified educators offering core curriculum courses (free) and supplementary paid courses.
- **Parents** (Future Phase): Track progress through guardian accounts.

---

## **5. Key Features & Workflow**

### **1. User Registration & Onboarding**  
- **Teachers**: Verify via government-issued IDs; create classes with auto-generated codes synced to school timetables.  
- **Students**: Join via class code; facial recognition liveness checks prevent fake accounts.  

### **2. AI-Driven Course Enrollment**  
- **Core Courses**: Auto-enrolled based on school curriculum.  
- **Paid Courses**: Recommender system uses collaborative filtering (e.g., "Students who took Algebra also enrolled in Geometry").  

### **3. Adaptive Learning Engine**  
- **Dynamic Content**: Videos, quizzes, and simulations adjust difficulty using performance data (e.g., quiz retry rates).  
- **Milestone Alerts**: Flag students deviating >15% from class pace via email/SMS notifications.  

### **4. Collaborative Learning Pods**  
- **Auto-Grouping**: AI creates mixed-skills groups (2 advanced + 3 struggling learners) for project-based tasks.  
- **Peer Mentoring**: Advanced students earn 2x credit points for assisting peers.  

### **5. Credit & Rewards System**  
- **Earning**: 10 pts/upvoted question, 20 pts/quiz completion, 50 pts/milestone.  
- **Redemption**: Unlock premium courses (500 pts) or donate to charity (e.g., 1,000 pts = school supplies for rural students).  

### **6. Teacher Tools**  
- **Dashboard**: Real-time analytics on engagement (avg. response time, question quality).  
- **Certification**: Digital badges aligned with MOET standards, shareable on LinkedIn.  

---

## **6. Technology Stack**  
- **Frontend**: React.js (web), Flutter (mobile) with offline-mode support.  
- **Backend**: Node.js + Firebase for real-time updates; AWS S3 for content storage.  
- **AI**: TensorFlow for NLP (question filtering) and PyTorch for adaptive learning.  
- **Security**: AES-256 encryption, GDPR-compliant data policies.  

---

## **7. Business Model**  
- **Freemium**: Free core features; premium courses priced at $5-$20/month (teachers set rates).  
- **Revenue Split**: 70% teacher, 20% platform, 10% payment processing.  
- **Partnerships**: Collaborate with MOET for curriculum integration; pilot programs in Hanoi/Ho Chi Minh City.  

---

## **8. Scalability & Challenges**  
- **Low-Bandwidth Mode**: Compressed videos (144p) and text-only options for rural areas.  
- **Teacher Training**: Onboarding webinars + 24/7 chatbot support.  
- **Digital Divide**: Partner with telecoms to subsidize data costs for low-income students.  