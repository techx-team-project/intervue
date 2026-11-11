import 'package:file_picker/file_picker.dart';
import 'package:flutter/material.dart';
import 'package:flutter_bloc/flutter_bloc.dart';
import 'package:go_router/go_router.dart';
import 'package:intl/intl.dart';
import 'package:intervue_flutter/app/routes/route_names.dart';
import 'package:intervue_flutter/core/theme/app_colors.dart';
import 'package:intervue_flutter/core/utils/file_helpers.dart';
import 'package:intervue_flutter/features/auth/presentation/controllers/auth_bloc.dart';
import 'package:intervue_flutter/features/resume/data/models/candidate_resume_model.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_cubit.dart';
import 'package:intervue_flutter/features/resume/presentation/controllers/candidate_cv_state.dart';

class TopCvBuilderTab extends StatefulWidget {
  const TopCvBuilderTab({super.key});

  @override
  State<TopCvBuilderTab> createState() => _TopCvBuilderTabState();
}

class _TopCvBuilderTabState extends State<TopCvBuilderTab>
    with SingleTickerProviderStateMixin {
  late final TabController _tabController;

  static const List<_TemplateItem> _templates = [
    _TemplateItem(
      title: 'Mẫu CV Chuẩn ATS Quốc Tế',
      category: 'Khuyên dùng cho IT & Tech',
      downloads: '250K+ lượt dùng',
      color: Color(0xFF00B14F),
      badge: 'TOP 1',
    ),
    _TemplateItem(
      title: 'Mẫu CV Senior Chuyên Nghiệp',
      category: 'Kinh doanh & Quản lý',
      downloads: '180K+ lượt dùng',
      color: Color(0xFF1E88E5),
      badge: 'HOT',
    ),
    _TemplateItem(
      title: 'Mẫu CV Sáng Tạo (Creative)',
      category: 'Marketing & Thiết kế UI/UX',
      downloads: '140K+ lượt dùng',
      color: Color(0xFF8E24AA),
      badge: 'TREND',
    ),
    _TemplateItem(
      title: 'Mẫu CV Fresher / Sinh Viên',
      category: 'Thực tập & Mới tốt nghiệp',
      downloads: '320K+ lượt dùng',
      color: Color(0xFFFF6F00),
      badge: 'DỄ DÙNG',
    ),
  ];

  @override
  void initState() {
    super.initState();
    _tabController = TabController(length: 2, vsync: this);
  }

  @override
  void dispose() {
    _tabController.dispose();
    super.dispose();
  }

  Future<void> _pickAndUploadCv() async {
    final isAuthenticated = context.read<AuthBloc>().state is AuthAuthenticated;
    if (!isAuthenticated) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(
          content: const Text('Vui lòng đăng nhập để quản lý và tải lên CV'),
          action: SnackBarAction(
            label: 'Đăng nhập',
            onPressed: () => context.push(RouteNames.login),
          ),
        ),
      );
      return;
    }

    final state = context.read<CandidateCvCubit>().state;
    if (state is CandidateCvLoaded && state.cvs.length >= 3) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text(
            'Bạn đã đạt giới hạn lưu trữ tối đa (3 CV). Vui lòng xóa bớt CV cũ để tải lên CV mới.',
          ),
          backgroundColor: AppColors.accentOrange,
        ),
      );
      return;
    }

    try {
      final result = await FilePicker.platform.pickFiles(
        type: FileType.custom,
        allowedExtensions: const ['pdf'],
        withData: true,
      );
      final file = result?.files.single;
      if (file == null || file.bytes == null || !mounted) return;

      if (!FileHelpers.isValidCv(path: file.name, sizeBytes: file.size)) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(
            content: Text('File phải là định dạng PDF và dung lượng dưới 5MB'),
            backgroundColor: AppColors.error,
          ),
        );
        return;
      }

      await context.read<CandidateCvCubit>().uploadCv(
        bytes: file.bytes!,
        fileName: file.name,
      );
    } catch (_) {
      if (!mounted) return;
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(
          content: Text('Không thể chọn file. Vui lòng thử lại.'),
          backgroundColor: AppColors.error,
        ),
      );
    }
  }

  Future<void> _showRenameDialog(CandidateResumeModel cv) async {
    final controller = TextEditingController(text: cv.fileName);
    final formKey = GlobalKey<FormState>();

    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Đổi tên file CV'),
        content: Form(
          key: formKey,
          child: TextFormField(
            controller: controller,
            autofocus: true,
            decoration: const InputDecoration(
              labelText: 'Tên file mới',
              hintText: 'VD: NguyenVanA_CV_Flutter.pdf',
              border: OutlineInputBorder(),
            ),
            validator: (value) {
              if (value == null || value.trim().isEmpty) {
                return 'Tên file không được để trống';
              }
              if (!value.toLowerCase().endsWith('.pdf')) {
                return 'Tên file phải có đuôi .pdf';
              }
              return null;
            },
          ),
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(false),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.primary,
              foregroundColor: Colors.white,
            ),
            onPressed: () {
              if (formKey.currentState?.validate() ?? false) {
                Navigator.of(dialogCtx).pop(true);
              }
            },
            child: const Text('Lưu thay đổi'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<CandidateCvCubit>().renameCv(
        id: cv.id,
        newName: controller.text.trim(),
      );
    }
    controller.dispose();
  }

  Future<void> _showDeleteConfirmDialog(CandidateResumeModel cv) async {
    final confirmed = await showDialog<bool>(
      context: context,
      builder: (dialogCtx) => AlertDialog(
        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(16)),
        title: const Text('Xác nhận xóa CV'),
        content: Text(
          'Bạn có chắc chắn muốn xóa file "${cv.fileName}" khỏi kho CV không? Thao tác này không thể hoàn tác.',
        ),
        actions: [
          TextButton(
            onPressed: () => Navigator.of(dialogCtx).pop(false),
            child: const Text('Hủy'),
          ),
          ElevatedButton(
            style: ElevatedButton.styleFrom(
              backgroundColor: AppColors.error,
              foregroundColor: Colors.white,
            ),
            onPressed: () => Navigator.of(dialogCtx).pop(true),
            child: const Text('Xóa vĩnh viễn'),
          ),
        ],
      ),
    );

    if (confirmed == true && mounted) {
      await context.read<CandidateCvCubit>().deleteCv(cv.id);
    }
  }

  @override
  Widget build(BuildContext context) {
    return BlocListener<CandidateCvCubit, CandidateCvState>(
      listener: (context, state) {
        if (state is CandidateCvLoaded && state.actionMessage != null) {
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(
              SnackBar(
                content: Text(state.actionMessage!),
                backgroundColor: AppColors.primary,
              ),
            );
        } else if (state is CandidateCvError) {
          ScaffoldMessenger.of(context)
            ..hideCurrentSnackBar()
            ..showSnackBar(
              SnackBar(
                content: Text(state.message),
                backgroundColor: AppColors.error,
              ),
            );
        }
      },
      child: Scaffold(
        backgroundColor: AppColors.background,
        appBar: AppBar(
          title: const Text(
            'Quản lý CV & Mẫu Hồ sơ',
            style: TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 18,
              color: AppColors.textPrimary,
            ),
          ),
          actions: [
            IconButton(
              tooltip: 'Tải CV lên',
              icon: const Icon(Icons.upload_file_rounded),
              onPressed: _pickAndUploadCv,
            ),
          ],
          bottom: TabBar(
            controller: _tabController,
            indicatorColor: AppColors.primary,
            indicatorWeight: 3,
            labelColor: AppColors.primary,
            unselectedLabelColor: AppColors.textSecondary,
            labelStyle: const TextStyle(
              fontWeight: FontWeight.bold,
              fontSize: 14,
            ),
            tabs: const [
              Tab(text: 'CV của tôi'),
              Tab(text: 'Mẫu CV Chuẩn ATS'),
            ],
          ),
        ),
        body: TabBarView(
          controller: _tabController,
          children: [_buildMyCvsTab(), _buildTemplatesTab()],
        ),
      ),
    );
  }

  Widget _buildMyCvsTab() {
    final authState = context.watch<AuthBloc>().state;
    final isAuthenticated = authState is AuthAuthenticated;

    if (!isAuthenticated) {
      return Center(
        child: Padding(
          padding: const EdgeInsets.all(24),
          child: Column(
            mainAxisSize: MainAxisSize.min,
            children: [
              Container(
                width: 80,
                height: 80,
                decoration: const BoxDecoration(
                  color: AppColors.primaryLight,
                  shape: BoxShape.circle,
                ),
                child: const Icon(
                  Icons.folder_shared_outlined,
                  size: 40,
                  color: AppColors.primary,
                ),
              ),
              const SizedBox(height: 16),
              const Text(
                'Đăng nhập để xem kho CV',
                style: TextStyle(
                  fontSize: 17,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
              const SizedBox(height: 8),
              const Text(
                'Lưu trữ tối đa 3 CV PDF chuẩn ATS trong tài khoản để nộp đơn ứng tuyển nhanh chóng.',
                textAlign: TextAlign.center,
                style: TextStyle(
                  fontSize: 13,
                  color: AppColors.textSecondary,
                  height: 1.4,
                ),
              ),
              const SizedBox(height: 20),
              ElevatedButton.icon(
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppColors.primary,
                  foregroundColor: Colors.white,
                  padding: const EdgeInsets.symmetric(
                    horizontal: 24,
                    vertical: 12,
                  ),
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(10),
                  ),
                ),
                icon: const Icon(Icons.login_rounded, size: 18),
                label: const Text(
                  'Đăng nhập ngay',
                  style: TextStyle(fontWeight: FontWeight.bold),
                ),
                onPressed: () => context.push(RouteNames.login),
              ),
            ],
          ),
        ),
      );
    }

    return BlocBuilder<CandidateCvCubit, CandidateCvState>(
      builder: (context, state) {
        if (state is CandidateCvLoading) {
          return const Center(child: CircularProgressIndicator());
        }

        if (state is CandidateCvError && state.message.isNotEmpty) {
          return Center(
            child: Padding(
              padding: const EdgeInsets.all(24),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(
                    Icons.error_outline_rounded,
                    size: 48,
                    color: AppColors.error,
                  ),
                  const SizedBox(height: 12),
                  Text(
                    state.message,
                    textAlign: TextAlign.center,
                    style: const TextStyle(color: AppColors.textPrimary),
                  ),
                  const SizedBox(height: 16),
                  OutlinedButton.icon(
                    icon: const Icon(Icons.refresh_rounded, size: 18),
                    label: const Text('Thử lại'),
                    onPressed: () => context.read<CandidateCvCubit>().loadCvs(),
                  ),
                ],
              ),
            ),
          );
        }

        final cvs = state is CandidateCvLoaded
            ? state.cvs
            : <CandidateResumeModel>[];
        final isUploading = state is CandidateCvLoaded && state.isUploading;

        return RefreshIndicator(
          onRefresh: () => context.read<CandidateCvCubit>().loadCvs(),
          child: ListView(
            padding: const EdgeInsets.all(16),
            children: [
              // Quota & Upload Header Card
              Container(
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: Colors.white,
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: AppColors.border),
                  boxShadow: [
                    BoxShadow(
                      color: Colors.black.withValues(alpha: 0.02),
                      blurRadius: 8,
                      offset: const Offset(0, 2),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Row(
                            children: [
                              const Text(
                                'Kho lưu trữ CV:',
                                style: TextStyle(
                                  fontSize: 14,
                                  fontWeight: FontWeight.bold,
                                  color: AppColors.textPrimary,
                                ),
                              ),
                              const SizedBox(width: 8),
                              Container(
                                padding: const EdgeInsets.symmetric(
                                  horizontal: 8,
                                  vertical: 2,
                                ),
                                decoration: BoxDecoration(
                                  color: cvs.length >= 3
                                      ? AppColors.badgeUrgentLight
                                      : AppColors.primaryLight,
                                  borderRadius: BorderRadius.circular(6),
                                ),
                                child: Text(
                                  '${cvs.length}/3 CV',
                                  style: TextStyle(
                                    fontSize: 12,
                                    fontWeight: FontWeight.bold,
                                    color: cvs.length >= 3
                                        ? AppColors.error
                                        : AppColors.primaryDarker,
                                  ),
                                ),
                              ),
                            ],
                          ),
                          const SizedBox(height: 4),
                          const Text(
                            'Chấp nhận file PDF tối đa 5MB.',
                            style: TextStyle(
                              fontSize: 12,
                              color: AppColors.textSecondary,
                            ),
                          ),
                        ],
                      ),
                    ),
                    const SizedBox(width: 12),
                    ElevatedButton.icon(
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppColors.primary,
                        foregroundColor: Colors.white,
                        elevation: 0,
                        shape: RoundedRectangleBorder(
                          borderRadius: BorderRadius.circular(10),
                        ),
                        padding: const EdgeInsets.symmetric(
                          horizontal: 14,
                          vertical: 10,
                        ),
                      ),
                      icon: isUploading
                          ? const SizedBox(
                              width: 16,
                              height: 16,
                              child: CircularProgressIndicator(
                                strokeWidth: 2,
                                color: Colors.white,
                              ),
                            )
                          : const Icon(Icons.add_rounded, size: 18),
                      label: Text(
                        isUploading ? 'Đang tải...' : 'Thêm CV',
                        style: const TextStyle(fontWeight: FontWeight.bold),
                      ),
                      onPressed: isUploading || cvs.length >= 3
                          ? null
                          : _pickAndUploadCv,
                    ),
                  ],
                ),
              ),

              const SizedBox(height: 16),

              if (cvs.isEmpty) ...[
                const SizedBox(height: 32),
                Center(
                  child: Column(
                    children: [
                      Container(
                        width: 72,
                        height: 72,
                        decoration: BoxDecoration(
                          color: Colors.grey.shade100,
                          shape: BoxShape.circle,
                        ),
                        child: const Icon(
                          Icons.picture_as_pdf_outlined,
                          size: 36,
                          color: Colors.grey,
                        ),
                      ),
                      const SizedBox(height: 16),
                      const Text(
                        'Chưa có file CV nào trong kho',
                        style: TextStyle(
                          fontSize: 16,
                          fontWeight: FontWeight.bold,
                          color: AppColors.textPrimary,
                        ),
                      ),
                      const SizedBox(height: 6),
                      const Text(
                        'Tải lên file PDF CV của bạn để sẵn sàng ứng tuyển các việc làm mong muốn.',
                        textAlign: TextAlign.center,
                        style: TextStyle(
                          fontSize: 12.5,
                          color: AppColors.textSecondary,
                        ),
                      ),
                      const SizedBox(height: 20),
                      OutlinedButton.icon(
                        style: OutlinedButton.styleFrom(
                          foregroundColor: AppColors.primary,
                          side: const BorderSide(color: AppColors.primary),
                        ),
                        icon: const Icon(Icons.upload_file_rounded),
                        label: const Text('Tải lên CV đầu tiên'),
                        onPressed: _pickAndUploadCv,
                      ),
                    ],
                  ),
                ),
              ] else ...[
                const Text(
                  'Danh sách CV của bạn',
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: AppColors.textPrimary,
                  ),
                ),
                const SizedBox(height: 10),
                ...cvs.map((cv) => _buildCvCard(cv)),
              ],
            ],
          ),
        );
      },
    );
  }

  Widget _buildCvCard(CandidateResumeModel cv) {
    final dateFormat = DateFormat('dd/MM/yyyy HH:mm');
    final formattedDate = cv.createdAt != null
        ? dateFormat.format(cv.createdAt!)
        : '';

    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(14),
        border: Border.all(color: AppColors.border),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withValues(alpha: 0.02),
            blurRadius: 6,
            offset: const Offset(0, 2),
          ),
        ],
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        leading: Container(
          width: 44,
          height: 48,
          decoration: BoxDecoration(
            color: const Color(0xFFEF4444).withValues(alpha: 0.1),
            borderRadius: BorderRadius.circular(8),
          ),
          child: const Center(
            child: Icon(
              Icons.picture_as_pdf_rounded,
              color: Color(0xFFEF4444),
              size: 26,
            ),
          ),
        ),
        title: Row(
          children: [
            Expanded(
              child: Text(
                cv.fileName,
                maxLines: 1,
                overflow: TextOverflow.ellipsis,
                style: const TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.bold,
                  color: AppColors.textPrimary,
                ),
              ),
            ),
            if (cv.isDefault) ...[
              const SizedBox(width: 6),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 6, vertical: 2),
                decoration: BoxDecoration(
                  color: AppColors.primaryLight,
                  borderRadius: BorderRadius.circular(4),
                ),
                child: const Text(
                  'Mặc định',
                  style: TextStyle(
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                    color: AppColors.primaryDarker,
                  ),
                ),
              ),
            ],
          ],
        ),
        subtitle: Padding(
          padding: const EdgeInsets.only(top: 4),
          child: Text(
            '${FileHelpers.formatSize(cv.fileSizeBytes)}${formattedDate.isNotEmpty ? ' • $formattedDate' : ''}',
            style: const TextStyle(
              fontSize: 11.5,
              color: AppColors.textSecondary,
            ),
          ),
        ),
        trailing: PopupMenuButton<String>(
          icon: const Icon(Icons.more_vert_rounded, color: Colors.grey),
          onSelected: (value) {
            switch (value) {
              case 'rename':
                _showRenameDialog(cv);
              case 'review':
                context.push(RouteNames.resume);
              case 'delete':
                _showDeleteConfirmDialog(cv);
            }
          },
          itemBuilder: (context) => [
            const PopupMenuItem(
              value: 'review',
              child: Row(
                children: [
                  Icon(Icons.auto_awesome, size: 18, color: AppColors.primary),
                  SizedBox(width: 10),
                  Text('AI Chấm điểm CV'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'rename',
              child: Row(
                children: [
                  Icon(Icons.edit_outlined, size: 18),
                  SizedBox(width: 10),
                  Text('Đổi tên file'),
                ],
              ),
            ),
            const PopupMenuItem(
              value: 'delete',
              child: Row(
                children: [
                  Icon(Icons.delete_outline, size: 18, color: AppColors.error),
                  SizedBox(width: 10),
                  Text('Xóa CV', style: TextStyle(color: AppColors.error)),
                ],
              ),
            ),
          ],
        ),
      ),
    );
  }

  Widget _buildTemplatesTab() {
    return ListView(
      padding: const EdgeInsets.all(16),
      children: [
        // AI CV Score Banner
        Container(
          padding: const EdgeInsets.all(16),
          decoration: BoxDecoration(
            gradient: const LinearGradient(
              colors: [Color(0xFF0A4E26), Color(0xFF00B14F)],
              begin: Alignment.topLeft,
              end: Alignment.bottomRight,
            ),
            borderRadius: BorderRadius.circular(16),
          ),
          child: Row(
            children: [
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Container(
                      padding: const EdgeInsets.symmetric(
                        horizontal: 8,
                        vertical: 3,
                      ),
                      decoration: BoxDecoration(
                        color: Colors.white.withValues(alpha: 0.2),
                        borderRadius: BorderRadius.circular(6),
                      ),
                      child: const Text(
                        'INTERVUE AI TECHNOLOGY',
                        style: TextStyle(
                          color: Colors.white,
                          fontSize: 10,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                    const SizedBox(height: 8),
                    const Text(
                      'Chấm điểm CV cùng AI',
                      style: TextStyle(
                        color: Colors.white,
                        fontSize: 17,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                    const SizedBox(height: 4),
                    const Text(
                      'So khớp CV với yêu cầu tuyển dụng để tăng 80% tỷ lệ phỏng vấn.',
                      style: TextStyle(color: Colors.white70, fontSize: 12),
                    ),
                  ],
                ),
              ),
              const SizedBox(width: 12),
              ElevatedButton(
                style: ElevatedButton.styleFrom(
                  backgroundColor: Colors.white,
                  foregroundColor: AppColors.primaryDarker,
                  shape: RoundedRectangleBorder(
                    borderRadius: BorderRadius.circular(20),
                  ),
                  padding: const EdgeInsets.symmetric(
                    horizontal: 14,
                    vertical: 10,
                  ),
                ),
                onPressed: () => context.push(RouteNames.resume),
                child: const Text(
                  'Chấm điểm',
                  style: TextStyle(fontWeight: FontWeight.bold, fontSize: 12),
                ),
              ),
            ],
          ),
        ),

        const SizedBox(height: 20),

        // Categories & Filter chips
        const Row(
          mainAxisAlignment: MainAxisAlignment.spaceBetween,
          children: [
            Text(
              'Mẫu CV xin việc phổ biến',
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: AppColors.textPrimary,
              ),
            ),
            Text(
              '50+ mẫu',
              style: TextStyle(
                fontSize: 12.5,
                color: AppColors.textSecondary,
                fontWeight: FontWeight.w600,
              ),
            ),
          ],
        ),

        const SizedBox(height: 12),

        // Template Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          itemCount: _templates.length,
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 2,
            crossAxisSpacing: 12,
            mainAxisSpacing: 14,
            childAspectRatio: 0.72,
          ),
          itemBuilder: (context, index) {
            final tpl = _templates[index];
            return Container(
              decoration: BoxDecoration(
                color: Colors.white,
                borderRadius: BorderRadius.circular(14),
                border: Border.all(color: AppColors.border),
                boxShadow: [
                  BoxShadow(
                    color: Colors.black.withValues(alpha: 0.03),
                    blurRadius: 6,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: Column(
                crossAxisAlignment: CrossAxisAlignment.start,
                children: [
                  Expanded(
                    child: Container(
                      decoration: BoxDecoration(
                        color: tpl.color.withValues(alpha: 0.08),
                        borderRadius: const BorderRadius.vertical(
                          top: Radius.circular(14),
                        ),
                      ),
                      child: Stack(
                        children: [
                          Center(
                            child: Container(
                              width: 90,
                              height: 110,
                              padding: const EdgeInsets.all(8),
                              decoration: BoxDecoration(
                                color: Colors.white,
                                borderRadius: BorderRadius.circular(6),
                                boxShadow: [
                                  BoxShadow(
                                    color: Colors.black.withValues(alpha: 0.1),
                                    blurRadius: 4,
                                    offset: const Offset(0, 2),
                                  ),
                                ],
                              ),
                              child: Column(
                                crossAxisAlignment: CrossAxisAlignment.start,
                                children: [
                                  Row(
                                    children: [
                                      Container(
                                        width: 14,
                                        height: 14,
                                        decoration: BoxDecoration(
                                          color: tpl.color,
                                          shape: BoxShape.circle,
                                        ),
                                      ),
                                      const SizedBox(width: 4),
                                      Container(
                                        width: 40,
                                        height: 4,
                                        color: Colors.grey.shade400,
                                      ),
                                    ],
                                  ),
                                  const SizedBox(height: 8),
                                  Container(
                                    width: double.infinity,
                                    height: 3,
                                    color: Colors.grey.shade300,
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    width: 60,
                                    height: 3,
                                    color: Colors.grey.shade300,
                                  ),
                                  const SizedBox(height: 8),
                                  Container(
                                    width: double.infinity,
                                    height: 3,
                                    color: tpl.color.withValues(alpha: 0.5),
                                  ),
                                  const SizedBox(height: 4),
                                  Container(
                                    width: 50,
                                    height: 3,
                                    color: Colors.grey.shade300,
                                  ),
                                ],
                              ),
                            ),
                          ),
                          Positioned(
                            top: 8,
                            right: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(
                                horizontal: 6,
                                vertical: 2,
                              ),
                              decoration: BoxDecoration(
                                color: tpl.color,
                                borderRadius: BorderRadius.circular(4),
                              ),
                              child: Text(
                                tpl.badge,
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 9,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),
                    ),
                  ),
                  Padding(
                    padding: const EdgeInsets.all(10),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      children: [
                        Text(
                          tpl.title,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 12.5,
                            fontWeight: FontWeight.bold,
                            color: AppColors.textPrimary,
                          ),
                        ),
                        const SizedBox(height: 2),
                        Text(
                          tpl.category,
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                          style: const TextStyle(
                            fontSize: 10.5,
                            color: AppColors.textSecondary,
                          ),
                        ),
                        const SizedBox(height: 8),
                        SizedBox(
                          width: double.infinity,
                          child: OutlinedButton(
                            style: OutlinedButton.styleFrom(
                              padding: const EdgeInsets.symmetric(vertical: 6),
                              side: BorderSide(color: tpl.color),
                              shape: RoundedRectangleBorder(
                                borderRadius: BorderRadius.circular(8),
                              ),
                            ),
                            onPressed: () {
                              ScaffoldMessenger.of(context).showSnackBar(
                                SnackBar(
                                  content: Text('Đang mở ${tpl.title}...'),
                                ),
                              );
                            },
                            child: Text(
                              'Dùng mẫu này',
                              style: TextStyle(
                                fontSize: 11,
                                fontWeight: FontWeight.bold,
                                color: tpl.color,
                              ),
                            ),
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),
            );
          },
        ),
      ],
    );
  }
}

class _TemplateItem {
  const _TemplateItem({
    required this.title,
    required this.category,
    required this.downloads,
    required this.color,
    required this.badge,
  });

  final String title;
  final String category;
  final String downloads;
  final Color color;
  final String badge;
}
