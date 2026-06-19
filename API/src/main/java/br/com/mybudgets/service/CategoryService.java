package br.com.mybudgets.service;

import br.com.mybudgets.domain.entity.Category;
import br.com.mybudgets.dto.request.CategoryRequest;
import br.com.mybudgets.exception.BusinessException;
import br.com.mybudgets.exception.ResourceNotFoundException;
import br.com.mybudgets.mapper.CategoryAssembler;
import br.com.mybudgets.repository.CategoryRepository;
import br.com.mybudgets.repository.UserRepository;
import br.com.mybudgets.dto.response.CategoryResponse;
import lombok.RequiredArgsConstructor;
import org.springframework.hateoas.CollectionModel;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
@RequiredArgsConstructor
public class CategoryService {

    private final CategoryRepository categoryRepository;
    private final UserRepository userRepository;
    private final CategoryAssembler categoryAssembler;

    @Transactional(readOnly = true)
    public CollectionModel<CategoryResponse> findAll(Long userId) {
        var categories = categoryRepository.findAllByUserId(userId);
        return categoryAssembler.toCollectionModel(categories);
    }

    @Transactional(readOnly = true)
    public CategoryResponse findById(Long id, Long userId) {
        var category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        return categoryAssembler.toModel(category);
    }

    @Transactional
    public CategoryResponse create(Long userId, CategoryRequest request) {
        if (categoryRepository.existsByNameAndUserId(request.name(), userId)) {
            throw new BusinessException("Já existe uma categoria com o nome: " + request.name());
        }

        var user = userRepository.findById(userId)
                .orElseThrow(() -> new ResourceNotFoundException("Usuário", userId));

        var category = Category.builder()
                .user(user)
                .name(request.name())
                .color(request.color())
                .type(request.type())
                .build();

        return categoryAssembler.toModel(categoryRepository.save(category));
    }

    @Transactional
    public CategoryResponse update(Long id, Long userId, CategoryRequest request) {
        var category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));

        if (categoryRepository.existsByNameAndUserId(request.name(), userId)
                && !category.getName().equals(request.name())) {
            throw new BusinessException("Já existe uma categoria com o nome: " + request.name());
        }

        category.setName(request.name());
        category.setColor(request.color());
        category.setType(request.type());

        return categoryAssembler.toModel(categoryRepository.save(category));
    }

    @Transactional
    public void delete(Long id, Long userId) {
        var category = categoryRepository.findByIdAndUserId(id, userId)
                .orElseThrow(() -> new ResourceNotFoundException("Categoria", id));
        categoryRepository.delete(category);
    }
}