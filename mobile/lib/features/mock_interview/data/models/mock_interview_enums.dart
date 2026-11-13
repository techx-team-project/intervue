enum MockInterviewFocusArea {
  technical(
    'TECHNICAL',
    'Technical Deep-Dive',
    'In-depth algorithms, language syntax, frameworks & optimization',
  ),
  systemDesign(
    'SYSTEM_DESIGN',
    'System Design & Architecture',
    'Microservices, distributed database schemas & scalability',
  ),
  behavioral(
    'BEHAVIORAL',
    'Behavioral & Situational',
    'Conflict resolution, leadership, project management & teamwork',
  ),
  mixed(
    'MIXED',
    'Comprehensive (Mixed)',
    'Balanced blend of coding, architecture, and real-world behavioral scenarios',
  );

  const MockInterviewFocusArea(this.value, this.label, this.description);

  final String value;
  final String label;
  final String description;

  static MockInterviewFocusArea fromValue(String? value) =>
      values.firstWhere((e) => e.value == value, orElse: () => mixed);
}

enum MockInterviewStatus {
  inProgress('IN_PROGRESS'),
  completed('COMPLETED'),
  abandoned('ABANDONED');

  const MockInterviewStatus(this.value);

  final String value;

  static MockInterviewStatus fromValue(String? value) =>
      values.firstWhere((e) => e.value == value, orElse: () => inProgress);
}
