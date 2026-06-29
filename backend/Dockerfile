# Estágio 1: Compilação do .jar com Maven
FROM maven:3.9-eclipse-temurin-21 AS builder
WORKDIR /app

# Copia o pom.xml separado para aproveitar cache de dependências
COPY pom.xml .
RUN mvn dependency:go-offline -q

COPY src ./src
RUN mvn clean package -DskipTests -q

# Estágio 2: Runtime com JRE 21 slim
FROM eclipse-temurin:21-jre-alpine
WORKDIR /app

COPY --from=builder /app/target/*.jar app.jar

EXPOSE 8080

ENTRYPOINT ["java", "-jar", "app.jar"]
