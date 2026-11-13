enum CvSource {
  saved('My saved CVs'),
  upload('Upload a PDF'),
  text('Paste text');

  const CvSource(this.label);

  final String label;
}

class ReviewLevelOption {
  const ReviewLevelOption({
    required this.level,
    required this.title,
    required this.description,
    required this.cost,
    this.isPaid = false,
  });

  final int level;
  final String title;
  final String description;
  final String cost;
  final bool isPaid;
}

class CreditPackage {
  const CreditPackage({
    required this.amount,
    required this.price,
    required this.description,
    this.popular = false,
  });

  final int amount;
  final String price;
  final String description;
  final bool popular;
}

abstract final class CvReviewOptions {
  static const int paidLevel = 3;
  static const int defaultTopupAmount = 10;

  static const List<String> popularPositions = [
    'Backend Java Developer',
    'Frontend React Developer',
    'Fullstack Engineer',
    'Mobile Flutter Developer',
    'Data Analyst / Engineer',
    'DevOps / Cloud Engineer',
  ];

  static const List<ReviewLevelOption> levels = [
    ReviewLevelOption(
      level: 1,
      title: 'General review',
      description:
          'ATS score, formatting and basic language checks for your CV.',
      cost: 'Free · 3 per day',
    ),
    ReviewLevelOption(
      level: 2,
      title: 'Target role',
      description:
          'Keyword and STAR improvements tailored to the role you want.',
      cost: 'Free · 3 per day',
    ),
    ReviewLevelOption(
      level: 3,
      title: 'Job match',
      description: 'Compare every requirement of a real job post with evidence from your CV.',
      cost: '1 credit per run',
      isPaid: true,
    ),
  ];

  static const List<CreditPackage> topupPackages = [
    CreditPackage(
      amount: 5,
      price: '50,000 VND',
      description: '5 job match reviews',
    ),
    CreditPackage(
      amount: 10,
      price: '90,000 VND',
      description: 'Save 10%. Good for an active job search',
      popular: true,
    ),
    CreditPackage(
      amount: 20,
      price: '160,000 VND',
      description: 'Save 20%. For a full application campaign',
    ),
  ];
}
