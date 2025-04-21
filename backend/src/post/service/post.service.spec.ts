import {
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { Test, TestingModule } from '@nestjs/testing';
import { Post } from '../entity/post.entity';
import { PostRepository } from '../repostory/post.repository';
import { PostService } from './post.service';

describe('PostService', () => {
  let postService: PostService;
  let postRepository: PostRepository;

  const mockPostRepository = {
    getById: jest.fn(),
    create: jest.fn(),
    updateById: jest.fn(),
    deleteById: jest.fn(),
  };

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        PostService,
        { provide: PostRepository, useValue: mockPostRepository },
      ],
    }).compile();

    postService = module.get<PostService>(PostService);
    postRepository = module.get<PostRepository>(PostRepository);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  const mockPost: Post = new Post({
    title: 'Test Title',
    content: 'Test content',
    user_id: 'user123',
    cover_img: 'http://example.com/img.png',
  });

  describe('getById', () => {
    it('should get post', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(mockPost);

      const res = await postService.getById(mockPost.id);

      expect(res).toEqual(mockPost);
      expect(postRepository.getById).toHaveBeenCalledWith(mockPost.id);
    });

    it('should throw 404 if post not found', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(undefined);

      await expect(postService.getById(mockPost.id)).rejects.toThrow(
        NotFoundException,
      );
    });
  });

  describe('create', () => {
    const { title, content, user_id, cover_img } = mockPost;
    const data = { title, content, user_id, cover_img };

    it('should create post', async () => {
      // @ts-ignore
      postRepository.create.mockResolvedValue(true);

      const res = await postService.create(data);

      expect(res).toEqual({ ...mockPost, ...res });
      expect(postRepository.create).toHaveBeenCalledWith({ ...data, ...res });
    });

    it('should throw 500 if create fails', async () => {
      // @ts-ignore
      postRepository.create.mockResolvedValue(false);

      await expect(postService.create(data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('updateById', () => {
    const { title, content, user_id, cover_img } = mockPost;
    const data = { title, content, user_id, cover_img };

    it('should update post', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(mockPost);
      // @ts-ignore
      postRepository.updateById.mockResolvedValue(true);

      const res = await postService.updateById(mockPost.id, data);

      expect(res).toEqual(mockPost);
      expect(postRepository.updateById).toHaveBeenCalledWith(mockPost.id, {
        ...mockPost,
        ...data,
      });
    });

    it('should throw 404 if post not found', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(null);

      await expect(postService.getById(mockPost.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw 500 if update fails', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(mockPost);
      // @ts-ignore
      postRepository.updateById.mockResolvedValue(false);

      await expect(postService.updateById(mockPost.id, data)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });

  describe('deleteById', () => {
    const { title, content, user_id, cover_img } = mockPost;
    const data = { title, content, user_id, cover_img };

    it('should delete post', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(mockPost);
      // @ts-ignore
      postRepository.deleteById.mockResolvedValue(true);

      const res = await postService.deleteById(mockPost.id);

      expect(res).toBe(true);
      expect(postRepository.deleteById).toHaveBeenCalledWith(mockPost.id);
    });

    it('should throw 404 if post not found', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(null);

      await expect(postService.getById(mockPost.id)).rejects.toThrow(
        NotFoundException,
      );
    });

    it('should throw 500 if update fails', async () => {
      // @ts-ignore
      postRepository.getById.mockResolvedValue(mockPost);
      // @ts-ignore
      postRepository.deleteById.mockResolvedValue(false);

      await expect(postService.deleteById(mockPost.id)).rejects.toThrow(
        InternalServerErrorException,
      );
    });
  });
});
