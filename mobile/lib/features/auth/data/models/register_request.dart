class RegisterRequest {
  const RegisterRequest({
    required this.name,
    required this.email,
    required this.password,
    required this.confirmPassword,
    this.acceptTerms = true,
  });

  final String name;
  final String email;
  final String password;
  final String confirmPassword;
  final bool acceptTerms;

  Map<String, dynamic> toJson() => {
    'name': name,
    'email': email,
    'password': password,
    'confirmPassword': confirmPassword,
    'acceptTerms': acceptTerms,
  };
}
