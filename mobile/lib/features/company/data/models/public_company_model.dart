import 'package:equatable/equatable.dart';

class PublicCompanyModel extends Equatable {
  const PublicCompanyModel({
    required this.id,
    required this.name,
    this.tradingName,
    this.address,
    this.industry,
    this.size,
    this.website,
    this.email,
    this.phone,
    this.description,
    this.benefits,
    this.logoUrl,
    this.photoUrls = const [],
  });

  factory PublicCompanyModel.fromJson(Map<String, dynamic> json) =>
      PublicCompanyModel(
        id: (json['id'] as num).toInt(),
        name: json['name'] as String? ?? '',
        tradingName: json['tradingName'] as String?,
        address: json['address'] as String?,
        industry: json['industry'] as String?,
        size: json['size'] as String?,
        website: json['website'] as String?,
        email: json['email'] as String?,
        phone: json['phone'] as String?,
        description: json['description'] as String?,
        benefits: json['benefits'] as String?,
        logoUrl: json['logoUrl'] as String?,
        photoUrls:
            (json['photoUrls'] as List<dynamic>?)
                ?.map((e) => e.toString())
                .toList() ??
            const [],
      );

  Map<String, dynamic> toJson() => {
    'id': id,
    'name': name,
    if (tradingName != null) 'tradingName': tradingName,
    if (address != null) 'address': address,
    if (industry != null) 'industry': industry,
    if (size != null) 'size': size,
    if (website != null) 'website': website,
    if (email != null) 'email': email,
    if (phone != null) 'phone': phone,
    if (description != null) 'description': description,
    if (benefits != null) 'benefits': benefits,
    if (logoUrl != null) 'logoUrl': logoUrl,
    'photoUrls': photoUrls,
  };

  final int id;
  final String name;
  final String? tradingName;
  final String? address;
  final String? industry;
  final String? size;
  final String? website;
  final String? email;
  final String? phone;
  final String? description;
  final String? benefits;
  final String? logoUrl;
  final List<String> photoUrls;

  String get displayName =>
      (tradingName != null && tradingName!.isNotEmpty) ? tradingName! : name;

  String get initials {
    final words = displayName.trim().split(RegExp(r'\s+'));
    if (words.length > 1) {
      return (words.first[0] + words[1][0]).toUpperCase();
    }
    return displayName.isNotEmpty ? displayName[0].toUpperCase() : 'C';
  }

  @override
  List<Object?> get props => [
    id,
    name,
    tradingName,
    address,
    industry,
    size,
    website,
    email,
    phone,
    description,
    benefits,
    logoUrl,
    photoUrls,
  ];
}
