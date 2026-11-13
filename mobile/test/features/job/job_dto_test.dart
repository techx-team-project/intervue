import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/features/job/data/models/job_dto.dart';

void main() {
  group('JobDTO', () {
    test('parse phản hồi tóm tắt của GET /api/v1/jobs', () {
      final dto = JobDTO.fromJson({
        'id': 42,
        'title': 'Flutter Developer',
        'company': {
          'id': 5,
          'name': 'Intervue',
          'logoUrl': 'https://x/logo.png',
        },
        'level': 'SENIOR',
        'workingArrangement': 'HYBRID',
        'city': 'Hanoi',
        'salary': {
          'negotiable': false,
          'min': 30000000,
          'max': 45000000,
          'currency': 'VND',
        },
        'skills': [
          {'id': 50, 'name': 'Flutter'},
          {'id': 15, 'name': 'Dart'},
        ],
        'deadline': '2030-12-31',
      });

      expect(dto.id, '42');
      expect(dto.companyName, 'Intervue');
      expect(dto.city, 'Hanoi');
      expect(dto.skills, ['Flutter', 'Dart']);
      expect(dto.deadline, DateTime(2030, 12, 31));

      final entity = dto.toEntity();
      expect(entity.displaySalary, '30 - 45M VND');
      expect(entity.salaryMinMillions, 30);
      expect(entity.salaryMaxMillions, 45);
      expect(entity.isSalaryNegotiable, isFalse);
      expect(entity.jobLevel, 'Senior');
      expect(entity.tags, ['Flutter', 'Dart']);
      expect(entity.companyLogo, 'https://x/logo.png');
    });

    test('parse phản hồi chi tiết có location và mô tả', () {
      final dto = JobDTO.fromJson({
        'id': 7,
        'title': 'Dev',
        'company': {'name': 'ACME'},
        'location': {'city': 'Da Nang', 'address': '1 Đường A'},
        'description': 'Mô tả',
        'requirements': 'Yêu cầu',
        'benefits': 'Quyền lợi',
      });

      expect(dto.city, 'Da Nang');
      expect(dto.toEntity().description, 'Mô tả');
      expect(dto.toEntity().requirements, 'Yêu cầu');
      expect(dto.toEntity().benefits, 'Quyền lợi');
    });

    test('hiển thị mức lương theo từng trường hợp', () {
      JobDTO withSalary(Map<String, dynamic> salary) => JobDTO.fromJson({
        'id': 1,
        'title': 'Dev',
        'company': {'name': 'ACME'},
        'salary': salary,
      });

      expect(
        withSalary({'negotiable': true}).toEntity().displaySalary,
        'Negotiable',
      );
      expect(
        withSalary({'negotiable': false, 'max': 30000000, 'currency': 'VND'})
            .toEntity()
            .displaySalary,
        'Up to 30M VND',
      );
      expect(
        withSalary({'negotiable': false, 'min': 10000000, 'currency': 'VND'})
            .toEntity()
            .displaySalary,
        'From 10M VND',
      );
      expect(
        withSalary({
          'negotiable': false,
          'min': 2000,
          'max': 3500,
          'currency': 'USD',
        }).toEntity().displaySalary,
        r'$2000 - $3500',
      );
    });

    test('việc làm remote không có thành phố hiển thị làm việc từ xa', () {
      final entity = JobDTO.fromJson({
        'id': 1,
        'title': 'Dev',
        'company': {'name': 'ACME'},
        'workingArrangement': 'REMOTE',
      }).toEntity();

      expect(entity.location, 'Remote');
    });

    test('isExpired và isUrgent dựa trên deadline', () {
      JobDTO withDeadline(DateTime date) => JobDTO.fromJson({
        'id': 1,
        'title': 'a',
        'company': {'name': 'b'},
        'deadline': date.toIso8601String().substring(0, 10),
      });

      expect(withDeadline(DateTime(2000)).toEntity().isExpired, isTrue);
      expect(withDeadline(DateTime(2999)).toEntity().isExpired, isFalse);
      expect(withDeadline(DateTime(2999)).toEntity().isUrgent, isFalse);
      expect(
        withDeadline(DateTime.now().add(const Duration(days: 3)))
            .toEntity()
            .isUrgent,
        isTrue,
      );
    });
  });
}
