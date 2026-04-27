package com.gestion.production_backend.entity;

import jakarta.persistence.*;
import jakarta.validation.constraints.*;
import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;
import java.time.LocalDate;

@Entity
@Data
@NoArgsConstructor
@AllArgsConstructor
public class OrdreFabrication {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotBlank
    private String produit;

    @Min(1)
    private Integer quantite;

    @NotNull
    private LocalDate date;

    @NotBlank
    private String machine;

    @NotBlank
    private String statut;

}
