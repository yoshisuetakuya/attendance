# OpenJDKの軽量版イメージを使う
FROM openjdk:17-alpine

# JARファイルをコンテナにコピー
ARG JAR_FILE=build/libs/*.jar
COPY ${JAR_FILE} app.jar

# ポート8080を開ける
EXPOSE 8080

# アプリケーションを起動
ENTRYPOINT ["java", "-jar", "/app.jar"]
