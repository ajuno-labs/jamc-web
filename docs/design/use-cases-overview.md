### **Student Use Cases**
| **Use Case**                     | **Description**                                                                 | **Solves**                                                                 |
|-----------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **1. Class Enrollment**           | Student enters class code → teacher verifies → gains access to synchronized class materials. | Ensures only legitimate students join classes (prevents overcrowding).     |
| **2. Self-Paced Learning**        | Student watches video lessons, completes quizzes, and progresses at their own pace while meeting milestones. | Addresses diverse learning speeds without disrupting class synchronization. |
| **3. AI-Filtered Q&A**            | Student submits a question → AI detects duplicates/priority → question surfaces to teacher. | Reduces repetitive questions, ensures critical issues get attention.       |
| **4. Peer Collaboration**         | Student joins a mixed-ability group to work on assignments or discuss lessons.  | Encourages interaction between faster/slower learners.                     |
| **5. Credit Point Earning**       | Student earns points by asking quality questions, helping peers, or hitting milestones. | Motivates engagement and provides formative assessment data.               |
| **6. Course Discovery**           | Student browses AI-recommended courses from other teachers based on performance. | Expands learning opportunities beyond their primary teacher.               |

---

### **Teacher Use Cases**
| **Use Case**                     | **Description**                                                                 | **Solves**                                                                 |
|-----------------------------------|---------------------------------------------------------------------------------|----------------------------------------------------------------------------|
| **1. Class Setup & Verification** | Teacher creates a virtual class, shares code, and approves/rejects enrollments. | Maintains controlled classroom sizes.                                      |
| **2. Progress Monitoring**        | Teacher views dashboard showing flagged students, completion rates, and engagement metrics. | Identifies struggling students early.                                      |
| **3. AI-Prioritized Q&A**         | Teacher answers questions filtered by AI based on urgency and frequency.       | Saves time by focusing on high-impact questions.                           |
| **4. Dynamic Group Management**   | Teacher creates mixed-ability groups or intervenes in AI-suggested groupings.   | Facilitates peer-to-peer learning without manual effort.                   |
| **5. Course Monetization**        | Teacher publishes paid courses for students outside their official classes.     | Creates income opportunities while scaling reach.                          |
| **6. Feedback Loop**              | Teacher reviews course ratings and adjusts content based on student feedback.   | Improves course quality over time.                                         |

---

### **System Use Cases**
| **Use Case**                     | **Description**                                                                 | **Technology Used**                                                     |
|-----------------------------------|---------------------------------------------------------------------------------|--------------------------------------------------------------------------|
| **1. AI-Driven Recommendations**  | System suggests courses/resources based on student progress and peer behavior. | LangChain + Collaborative Filtering                                     |
| **2. Real-Time Notifications**    | Student/teacher receives alerts for new questions, approvals, or deadlines.    | Supabase Realtime or Socket.io                                          |
| **3. Automated Flagging**         | System flags students deviating from class pace (too fast/slow).               | Progress tracking algorithms + Threshold rules                          |
| **4. Payment Processing**         | Handles payments for cross-school course enrollments (VNPay/Stripe).           | Stripe API + VNPay integration                                          |
| **5. Certificate Generation**     | Auto-generates certificates when students complete milestones/courses.         | PDF libraries (e.g., `@react-pdf/renderer`) + Dynamic templates         |
| **6. Security & Role Management** | Ensures students can’t access teacher dashboards and vice versa.               | NextAuth.js/Supabase Auth with role-based access control (RBAC)         |

---

### **Admin Use Cases**
| **Use Case**                     | **Description**                                                                 |
|-----------------------------------|---------------------------------------------------------------------------------|
| **1. Platform Moderation**        | Review reported content/questions and ban abusive users.                       |
| **2. Revenue Distribution**       | Manage revenue-sharing models between teachers and the platform.               |
| **3. System Analytics**           | Monitor platform health (DAU, MAU, course completion rates).                   |
| **4. Localization**               | Adapt UI/UX for Vietnamese users (date formats, language, payment methods).    |

---

### **Example Scenario Flow**
**Use Case**: *A slower learner gets flagged and receives support*  
1. **System** detects student is behind pace → flags them in teacher dashboard.  
2. **Teacher** assigns student to a mixed-ability group via the platform.  
3. **Student** receives automated recommendations for remedial resources.  
4. **Peers** in the group help explain concepts via discussion boards.  
5. **Teacher** monitors progress via analytics and adjusts materials if needed.  

---

### **Edge Cases to Consider**
1. **Student Submits Low-Quality Questions**:  
   - AI filters out spam, teacher can downvote to deduct credit points.  
2. **Teacher Rejects Enrollment**:  
   - Student receives explanation and option to reapply.  
3. **Payment Failure for Cross-School Courses**:  
   - Grace period with reminder notifications before revoking access.  
4. **AI Misprioritization**:  
   - Teacher can manually override question priority.  

This framework ensures all core problems in your problem statement are addressed with actionable workflows. Would you like me to elaborate on any specific use case?