import 'package:flutter_test/flutter_test.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/core/utils/formatters.dart';

void main() {
  group('Formatters', () {
    test('currencyVnd', () {
      expect(Formatters.currencyVnd(15000000), '15.000.000 ₫');
    });

    test('date', () {
      expect(Formatters.date(DateTime(2026, 3, 5)), '05/03/2026');
    });

    test('millions bỏ phần thập phân thừa', () {
      expect(Formatters.millions(15), '15');
      expect(Formatters.millions(12.5), '12.5');
    });
  });

  group('FileHelpers', () {
    test('isValidCv kiểm tra đuôi file và dung lượng', () {
      expect(FileHelpers.isValidCv(path: 'a/cv.PDF', sizeBytes: 1024), isTrue);
      expect(FileHelpers.isValidCv(path: 'cv.exe', sizeBytes: 1024), isFalse);
      expect(
        FileHelpers.isValidCv(path: 'cv.pdf', sizeBytes: 6 * 1024 * 1024),
        isFalse,
      );
      expect(FileHelpers.isValidCv(path: 'noext', sizeBytes: 1), isFalse);
    });

    test('formatSize', () {
      expect(FileHelpers.formatSize(512), '512 B');
      expect(FileHelpers.formatSize(2048), '2.0 KB');
      expect(FileHelpers.formatSize(3 * 1024 * 1024), '3.0 MB');
    });
  });
}
