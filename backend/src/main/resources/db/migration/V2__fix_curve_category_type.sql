-- Corrige o tipo da coluna curve_category de char(1) para varchar(10)
-- para alinhar com o mapeamento @Enumerated(EnumType.STRING) do Hibernate
ALTER TABLE tb_products
    ALTER COLUMN curve_category TYPE VARCHAR(10);
