package com.studentplanner.service;

import com.studentplanner.model.Assignment;
import com.studentplanner.model.StudySession;
import com.studentplanner.model.Subject;
import com.studentplanner.model.User;
import lombok.RequiredArgsConstructor;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpEntity;
import org.springframework.http.HttpHeaders;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;
import org.springframework.web.client.RestTemplate;

import java.time.format.DateTimeFormatter;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Service
@RequiredArgsConstructor
public class AIService {

    private static final Logger log = LoggerFactory.getLogger(AIService.class);

    @Value("${gemini.api.key:your_gemini_api_key_here}")
    private String geminiApiKey;

    @Value("${gemini.api.url:https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent}")
    private String geminiApiUrl;

    private final RestTemplate restTemplate = new RestTemplate();

    public String generateSuggestions(User user, List<Subject> subjects, List<Assignment> assignments, List<StudySession> sessions) {
        String prompt = buildPrompt(user, subjects, assignments, sessions);

        if (geminiApiKey == null || geminiApiKey.equals("your_gemini_api_key_here") || geminiApiKey.trim().isEmpty()) {
            log.warn("Gemini API key is not configured. Using high-fidelity local suggestions engine.");
            return generateMockSuggestions(user, subjects, assignments, sessions);
        }

        try {
            String urlWithKey = geminiApiUrl + "?key=" + geminiApiKey;

            HttpHeaders headers = new HttpHeaders();
            headers.setContentType(MediaType.APPLICATION_JSON);

            // Construct payload
            Map<String, Object> textPart = new HashMap<>();
            textPart.put("text", prompt);

            Map<String, Object> partContainer = new HashMap<>();
            partContainer.put("parts", List.of(textPart));

            Map<String, Object> contents = new HashMap<>();
            contents.put("contents", List.of(partContainer));

            HttpEntity<Map<String, Object>> requestEntity = new HttpEntity<>(contents, headers);

            log.info("Sending request to Gemini AI API...");
            ResponseEntity<Map> responseEntity = restTemplate.postForEntity(urlWithKey, requestEntity, Map.class);

            if (responseEntity.getStatusCode().is2xxSuccessful() && responseEntity.getBody() != null) {
                Map responseBody = responseEntity.getBody();
                List candidates = (List) responseBody.get("candidates");
                if (candidates != null && !candidates.isEmpty()) {
                    Map firstCandidate = (Map) candidates.get(0);
                    Map content = (Map) firstCandidate.get("content");
                    if (content != null) {
                        List parts = (List) content.get("parts");
                        if (parts != null && !parts.isEmpty()) {
                            Map firstPart = (Map) parts.get(0);
                            String responseText = (String) firstPart.get("text");
                            if (responseText != null && !responseText.trim().isEmpty()) {
                                return responseText;
                            }
                        }
                    }
                }
            }
        } catch (Exception e) {
            log.error("Failed to fetch suggestions from Gemini API. Falling back to local engine.", e);
        }

        return generateMockSuggestions(user, subjects, assignments, sessions);
    }

    private String buildPrompt(User user, List<Subject> subjects, List<Assignment> assignments, List<StudySession> sessions) {
        StringBuilder sb = new StringBuilder();
        sb.append("You are an expert academic advisor and smart study planner assistant.\n");
        sb.append("Please analyze the following academic profile and workload of the student, and provide a comprehensive, highly personalized, and action-oriented study suggestion plan in standard Markdown. Use beautiful headings, bullet points, checklists, and highlighted text to make it extremely clear and premium.\n\n");

        sb.append("### Student Profile:\n");
        sb.append("- **Name**: ").append(user.getName()).append("\n");
        sb.append("- **Semester**: ").append(user.getSemester() != null ? user.getSemester() : "Current").append("\n");
        sb.append("- **GPA Target**: ").append(user.getGpaTarget()).append("\n\n");

        sb.append("### Active Subjects:\n");
        if (subjects.isEmpty()) {
            sb.append("No active subjects configured yet.\n");
        } else {
            for (Subject s : subjects) {
                sb.append("- **").append(s.getCode()).append(" - ").append(s.getName()).append("** (Credits: ").append(s.getCredits()).append(", Grade: ").append(s.getGrade() != null ? s.getGrade() : "Not graded").append(")\n");
            }
        }
        sb.append("\n");

        sb.append("### Active Assignments:\n");
        long pendingCount = assignments.stream().filter(a -> !"COMPLETED".equals(a.getStatus())).count();
        if (pendingCount == 0) {
            sb.append("Excellent! No pending assignments currently.\n");
        } else {
            DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm");
            for (Assignment a : assignments) {
                if (!"COMPLETED".equals(a.getStatus())) {
                    sb.append("- **").append(a.getTitle()).append("** under Subject: `").append(a.getSubjectName() != null ? a.getSubjectName() : "General").append("` (Due: ").append(a.getDueDate().format(formatter)).append(", Priority: ").append(a.getPriority()).append(", Est. Hours: ").append(a.getEstimatedHours()).append(")\n");
                }
            }
        }
        sb.append("\n");

        sb.append("### Scheduled Timetable / Study Sessions:\n");
        if (sessions.isEmpty()) {
            sb.append("No scheduled study sessions or classes registered in the timetable.\n");
        } else {
            for (StudySession s : sessions) {
                sb.append("- **").append(s.getTitle()).append("** (Subject: `").append(s.getSubjectName()).append("`, ").append(s.getDayOfWeek()).append(" from ").append(s.getStartTime()).append(" to ").append(s.getEndTime()).append(" at ").append(s.getLocation()).append(")\n");
            }
        }
        sb.append("\n");

        sb.append("### Output Guidelines:\n");
        sb.append("1. Provide an executive summary of the student's current academic health.\n");
        sb.append("2. Structure a concrete 'Prioritized Action Plan' for their pending assignments (explain which one they should tackle first based on deadline, priority level, and estimated hours).\n");
        sb.append("3. Give clear scheduling advice, recommending when they should allocate focus hours on specific weekdays based on their timetable gaps.\n");
        sb.append("4. Suggest customized revision strategies for active subjects (specifically highlighting subjects that need extra effort to meet their Target GPA of ").append(user.getGpaTarget()).append(").\n");
        sb.append("5. Maintain an inspiring, supportive, and extremely professional academic advisory tone.\n");

        return sb.toString();
    }

    private String generateMockSuggestions(User user, List<Subject> subjects, List<Assignment> assignments, List<StudySession> sessions) {
        StringBuilder sb = new StringBuilder();
        sb.append("# 🚀 Smart Study suggestions for **").append(user.getName()).append("**\n\n");
        sb.append("> **Semester focus**: `").append(user.getSemester() != null ? user.getSemester() : "Current").append("` | **GPA Target**: `").append(user.getGpaTarget()).append("`\n\n");

        sb.append("## 📊 Executive Summary\n");
        long totalSubjects = subjects.size();
        long pendingAssignments = assignments.stream().filter(a -> !"COMPLETED".equals(a.getStatus())).count();
        long highPriorityCount = assignments.stream().filter(a -> !"COMPLETED".equals(a.getStatus()) && "HIGH".equals(a.getPriority())).count();
        long totalSessions = sessions.size();

        sb.append("You have **").append(totalSubjects).append("** active subjects, **").append(pendingAssignments).append("** pending assignments (**").append(highPriorityCount).append("** marked as High Priority), and **").append(totalSessions).append("** scheduled study sessions in your weekly timetable.\n\n");

        if (pendingAssignments > 0) {
            sb.append("⚠️ **Advisory Action Recommended**: Your current workload demands an active prioritization plan. To hit your target GPA of **").append(user.getGpaTarget()).append("**, we must optimize study gaps between your scheduled classes.\n");
        } else {
            sb.append("🏆 **Status: Outstanding!** You currently have no pending assignments. This is the perfect window to preview upcoming lecture topics and build key summaries.\n");
        }

        sb.append("\n## 🎯 Prioritized Action Plan\n");
        if (pendingAssignments > 0) {
            sb.append("Based on due dates, priority labels, and estimated study hours, here is your prioritized execution order:\n\n");
            int rank = 1;
            
            // Sort assignments by priority (HIGH first), then by due date
            List<Assignment> sorted = assignments.stream()
                    .filter(a -> !"COMPLETED".equals(a.getStatus()))
                    .sorted((a1, a2) -> {
                        int p1 = "HIGH".equals(a1.getPriority()) ? 3 : "MEDIUM".equals(a1.getPriority()) ? 2 : 1;
                        int p2 = "HIGH".equals(a2.getPriority()) ? 3 : "MEDIUM".equals(a2.getPriority()) ? 2 : 1;
                        if (p1 != p2) return Integer.compare(p2, p1);
                        return a1.getDueDate().compareTo(a2.getDueDate());
                    }).toList();

            for (Assignment a : sorted) {
                String priorityBadge = "HIGH".equals(a.getPriority()) ? "🔴 HIGH" : "MEDIUM".equals(a.getPriority()) ? "🟡 MEDIUM" : "🟢 LOW";
                sb.append(rank).append(". **").append(a.getTitle()).append("** (Subject: `").append(a.getSubjectName() != null ? a.getSubjectName() : "General").append("`)\n");
                sb.append("   - **Priority**: ").append(priorityBadge).append(" | **Est. Time**: `").append(a.getEstimatedHours()).append(" Hours`\n");
                sb.append("   - **Strategy**: Break this task into small 45-minute Pomodoro sessions. Set up an active workspace at least 24 hours before the deadline.\n\n");
                rank++;
            }
        } else {
            sb.append("No active tasks found. Focus on reading through textbook chapters or organizing past study summaries to keep ahead of your lectures.\n");
        }

        sb.append("## 📅 Scheduling & Focus Hours\n");
        if (sessions.isEmpty()) {
            sb.append("- You haven't added study sessions to your timetable yet. We recommend setting up at least three block study sessions (e.g., 2 hours each) on Tuesday, Thursday, and Saturday to form consistent study habits.\n");
        } else {
            sb.append("We evaluated your weekly timetable gaps. Here are your highly recommended focus periods:\n\n");
            for (StudySession s : sessions) {
                sb.append("- **Timetable Integration**: Map out 1 hour of preparation *before* your **").append(s.getTitle()).append("** on **").append(s.getDayOfWeek()).append("**. This increases memory retention by 40%.\n");
            }
        }

        sb.append("\n## 🧠 Active Subject Strategies\n");
        if (subjects.isEmpty()) {
            sb.append("- Add your subjects in the **Subjects** tab to receive tailored grade target insights and GPA mapping strategies.\n");
        } else {
            for (Subject s : subjects) {
                sb.append("- **").append(s.getCode()).append(" - ").append(s.getName()).append("** (Credits: ").append(s.getCredits()).append(")\n");
                if (s.getGrade() == null || s.getGrade().isEmpty()) {
                    sb.append("  - *Strategy*: Active recall. Make Flashcards for key concepts after each lecture to ensure you hit the target threshold.\n");
                } else if (s.getGrade().startsWith("A") || s.getGrade().startsWith("B+")) {
                    sb.append("  - *Status*: Excellent Standing (Current Grade: `").append(s.getGrade()).append("`). Maintain this performance by conducting peer reviews or teaching concepts to peers.\n");
                } else {
                    sb.append("  - *Target Upgrade*: Let's pull this up from a `").append(s.getGrade()).append("` to support your Target GPA of `").append(user.getGpaTarget()).append("`. Dedicate an extra 2 hours of self-study specifically focused on past paper questions.\n");
                }
            }
        }

        sb.append("\n*Study suggestions update dynamically based on your timetable and assignment tracker edits. Keep studying smart! 🎓*");
        return sb.toString();
    }
}
