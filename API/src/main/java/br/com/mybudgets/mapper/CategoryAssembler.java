package br.com.mybudgets.mapper;

import br.com.mybudgets.controller.CategoryController;
import br.com.mybudgets.domain.entity.Category;
import br.com.mybudgets.dto.response.CategoryResponse;
import org.springframework.hateoas.CollectionModel;
import org.springframework.hateoas.Link;
import org.springframework.hateoas.server.mvc.RepresentationModelAssemblerSupport;
import org.springframework.stereotype.Component;

@Component
public class CategoryAssembler
        extends RepresentationModelAssemblerSupport<Category, CategoryResponse> {

    private static final String BASE_URL = "/api/categories";

    public CategoryAssembler() {
        super(CategoryController.class, CategoryResponse.class);
    }

    @Override
    public CategoryResponse toModel(Category category) {
        CategoryResponse response = new CategoryResponse(
                category.getId(),
                category.getName(),
                category.getColor(),
                category.getType()
        );

        String selfUrl = BASE_URL + "/" + category.getId();

        response.add(
                Link.of(selfUrl).withSelfRel(),
                Link.of(selfUrl).withRel("update"),
                Link.of(selfUrl).withRel("delete"),
                Link.of(BASE_URL).withRel("categories")
        );

        return response;
    }

    @Override
    public CollectionModel<CategoryResponse> toCollectionModel(
            Iterable<? extends Category> entities) {
        CollectionModel<CategoryResponse> collection = super.toCollectionModel(entities);
        collection.add(Link.of(BASE_URL).withSelfRel());
        return collection;
    }
}