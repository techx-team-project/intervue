import 'package:intervue_flutter/core/constants/app_constants.dart';

abstract final class FileHelpers {
  static String extensionOf(String path) {
    final dot = path.lastIndexOf('.');
    return dot < 0 ? '' : path.substring(dot + 1).toLowerCase();
  }

  /// CV hợp lệ: đúng định dạng cho phép và không vượt dung lượng tối đa.
  static bool isValidCv({required String path, required int sizeBytes}) =>
      AppConstants.allowedCvExtensions.contains(extensionOf(path)) &&
      sizeBytes <= AppConstants.maxCvSizeBytes;

  static String formatSize(int bytes) {
    if (bytes < 1024) return '$bytes B';
    if (bytes < 1024 * 1024) return '${(bytes / 1024).toStringAsFixed(1)} KB';
    return '${(bytes / (1024 * 1024)).toStringAsFixed(1)} MB';
  }
}
