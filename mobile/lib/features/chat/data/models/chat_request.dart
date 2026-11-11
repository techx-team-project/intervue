class ChatContext {
  const ChatContext({
    this.pageType,
    this.entityId,
    this.jobTitle,
    this.companyName,
  });

  final String? pageType;
  final int? entityId;
  final String? jobTitle;
  final String? companyName;

  Map<String, dynamic> toJson() => {
    if (pageType != null) 'pageType': pageType,
    if (entityId != null) 'entityId': entityId,
    if (jobTitle != null) 'jobTitle': jobTitle,
    if (companyName != null) 'companyName': companyName,
  };
}

class ChatRequest {
  const ChatRequest({
    required this.message,
    this.sessionId,
    this.faqCode,
    this.context,
  });

  final String message;
  final String? sessionId;
  final String? faqCode;
  final ChatContext? context;

  Map<String, dynamic> toJson() => {
    'message': message,
    if (sessionId != null && sessionId!.isNotEmpty) 'sessionId': sessionId,
    if (faqCode != null && faqCode!.isNotEmpty) 'faqCode': faqCode,
    if (context != null) 'context': context!.toJson(),
  };
}
